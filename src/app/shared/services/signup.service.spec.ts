import { TestBed } from '@angular/core/testing';
import { SignupService } from './signup.service';
import { ThumbnailService, UsersService } from '@app/core/services/data-access';
import { Observable, of } from 'rxjs';

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
    it('should mark form as touched', () => {
      service.signup();
      expect(service.form.touched).toBeTrue();
    });

    describe('when form is invalid', () => {
      it('should not call createUser', () => {
        service.signup();
        expect(usersMock.createUser).not.toHaveBeenCalled();
      });
    });

    describe('when form is valid', () => {
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

        service.signup()?.subscribe();
        expect(usersMock.createUser).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          thumbnailUrl: 'http://testurl.com/thumbnail.jpg',
        });
      });
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
    let errors: Observable<string | undefined>;
    beforeEach(() => {
      errors = service.errorsFor('firstName');
    });

    it('should emit error message if control is invalid', () => {
      errors.subscribe((error) => expect(error).toBeDefined());
      service.form.setValue(formData({ firstName: '' }));
    });

    it('should emit undefined if control is valid', () => {
      errors.subscribe((error) => expect(error).toBeUndefined());
      service.form.setValue(formData({ firstName: 'John' }));
    });
  });
});
