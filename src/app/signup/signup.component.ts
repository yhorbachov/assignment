import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '@app/shared/components';
import { SignupService } from '@app/shared/services';
import { Subject, map } from 'rxjs';

@Component({
  standalone: true,
  imports: [TextInputComponent, AsyncPipe, ReactiveFormsModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  providers: [SignupService],
})
export default class SignupComponent {
  #destroyRef = inject(DestroyRef);
  signupSerivce = inject(SignupService);

  firstNameErrors$ = this.signupSerivce.errorsFor('firstName');
  lastNameErrors$ = this.signupSerivce.errorsFor('lastName');
  emailErrors$ = this.signupSerivce.errorsFor('email');
  passwordErrors$ = this.signupSerivce.errorsFor('password');

  successMsg$ = new Subject<string>();
  errorMsg$ = new Subject<string>();

  fullName$ = this.signupSerivce.form.valueChanges.pipe(map(({ firstName, lastName }) => `${firstName} ${lastName}`));

  signup() {
    this.signupSerivce.forceValidation();

    if (this.signupSerivce.form.invalid) return;

    this.signupSerivce
      .signup()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        complete: () => this.#handleSuccess(),
        error: () => this.#handleError(),
      });
  }

  #handleSuccess() {
    this.successMsg$.next('User signed up successfully');
  }

  #handleError() {
    this.errorMsg$.next('Error signing up user');
  }
}
