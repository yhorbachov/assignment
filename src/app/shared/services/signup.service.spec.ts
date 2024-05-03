import { TestBed } from '@angular/core/testing';
import { SignupService } from './signup.service';
import { ThumbnailService, UsersService } from '@app/core/services/data-access';
import { Observable, of } from 'rxjs';

import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';

const formData = (params: Partial<{ firstName: string; lastName: string; email: string; password: string }>) => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@test.com',
  password: 'PassWord123456',
  ...params,
});

describe('[Shared] SignupService', () => {
  let service: SignupService;
  let thumbnailMock: jasmine.SpyObj<ThumbnailService>;
  let usersMock: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    thumbnailMock = jasmine.createSpyObj('ThumbnailService', ['getThumbnailUrl']);
    usersMock = jasmine.createSpyObj('UsersService', ['createUser']);

    TestBed.configureTestingModule({
      providers: [
        SignupService,
        { provide: ThumbnailService, useValue: thumbnailMock },
        { provide: UsersService, useValue: usersMock },
      ],
    });

    service = TestBed.inject(SignupService);
  });

  describe('signup', () => {
    beforeEach(() => {
      service.form.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'PaSword123456',
      });
    });

    it('should call createUser', () => {
      thumbnailMock.getThumbnailUrl.and.returnValue(of('http://testurl.com/thumbnail.jpg'));
      usersMock.createUser.and.returnValue(of(undefined));

      subscribeSpyTo(service.signup());

      expect(usersMock.createUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        thumbnailUrl: 'http://testurl.com/thumbnail.jpg',
      });
    });
  });

  describe('forceValidation', () => {
    it('should emit validation errors', () => {
      const errors = service.errorsFor('firstName');
      const observerSpy = subscribeSpyTo(errors);
      service.forceValidation();
      expect(observerSpy.getValues()).toEqual(['First name is required']);
    });
  });

  describe('form validation', () => {
    it('should require firstName', () => {
      service.form.setValue(formData({ firstName: '' }));
      expect(service.form.valid).toBeFalse();
    });

    it('should require lastName', () => {
      service.form.setValue(formData({ lastName: '' }));
      expect(service.form.valid).toBeFalse();
    });

    describe('email', () => {
      it('should require email', () => {
        service.form.setValue(formData({ email: '' }));
        expect(service.form.valid).toBeFalse();
      });

      it('should require email to be valid', () => {
        service.form.setValue(formData({ email: 'invalid-email' }));
        expect(service.form.valid).toBeFalse();
      });
    });

    describe('password', () => {
      it('should require password', () => {
        service.form.setValue(formData({ password: '' }));
        expect(service.form.valid).toBeFalse();
      });

      it('should require password to be at least 8 characters', () => {
        service.form.setValue(formData({ password: 'short' }));
        expect(service.form.valid).toBeFalse();
      });

      it('should require password to contain at least one lowercase letter', () => {
        service.form.setValue(formData({ password: 'PASSWORD12312' }));
        expect(service.form.valid).toBeFalse();
      });

      it('should require password to contain at least one uppercase letter', () => {
        service.form.setValue(formData({ password: 'password12312' }));
        expect(service.form.valid).toBeFalse();
      });

      it('should not include firstName in password validation', () => {
        service.form.setValue(formData({ firstName: 'John', password: 'John123456' }));
        expect(service.form.valid).toBeFalse();
      });

      it('should not include lastName in password validation', () => {
        service.form.setValue(formData({ lastName: 'Doe', password: 'asdDoe123456' }));
        expect(service.form.valid).toBeFalse();
      });
    });
  });

  describe('getErrorMessage', () => {
    let errorsSpy: SubscriberSpy<string | undefined>;
    beforeEach(() => {
      errorsSpy = subscribeSpyTo(service.errorsFor('firstName'));
    });

    it('should emit error message if control is invalid', () => {
      service.form.setValue(formData({ firstName: '' }));
      service.forceValidation();
      expect(errorsSpy.getLastValue()).toEqual('First name is required');
    });

    it('should emit undefined if control is valid', () => {
      service.form.setValue(formData({ firstName: 'John' }));
      service.forceValidation();
      expect(errorsSpy.getLastValue()).toBeUndefined();
    });
  });
});
