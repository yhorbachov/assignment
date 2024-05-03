import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import SignupComponent from './signup.component';
import { SignupService } from '@app/shared/services';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

const createSignupServiceMock = () => {
  const fb = new FormBuilder().nonNullable;
  return {
    form: fb.group({
      firstName: fb.control(''),
      lastName: fb.control(''),
      email: fb.control(''),
      password: fb.control(''),
    }),
    forceValidation: jasmine.createSpy(),
    signup: jasmine.createSpy().and.returnValue(of(undefined)),
    errorsFor: jasmine.createSpy(),
  };
};

describe('[Signup] SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let signupServiceMock: ReturnType<typeof createSignupServiceMock>;

  beforeEach(waitForAsync(() => {
    signupServiceMock = createSignupServiceMock();

    TestBed.overrideComponent(SignupComponent, {
      set: {
        providers: [
          {
            provide: SignupService,
            useValue: signupServiceMock,
          },
        ],
      },
    });

    TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success message', () => {
    component.signup();
    fixture.detectChanges();
    const msg = fixture.debugElement.query(By.css('[data-testid="success-message"]'));
    expect(msg.nativeElement).toBeDefined();
  });

  it('should show error message', () => {
    signupServiceMock.signup.and.returnValue(throwError(() => 'error'));
    component.signup();
    fixture.detectChanges();
    const msg = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
    expect(msg.nativeElement).toBeDefined();
  });

  describe('on signup', () => {
    it('should call forceValidation', () => {
      component.signup();
      expect(signupServiceMock.forceValidation).toHaveBeenCalled();
    });

    it('should not call signup if form is invalid', () => {
      signupServiceMock.form.setErrors({ invalid: true });
      component.signup();
      expect(signupServiceMock.signup).not.toHaveBeenCalled();
    });

    it('should call signup if form is valid', () => {
      component.signup();
      expect(signupServiceMock.signup).toHaveBeenCalled();
    });
  });
});
