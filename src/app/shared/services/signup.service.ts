import { Injectable, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ThumbnailService, UsersService } from '@app/core/services/data-access';
import { Subject, first, map, merge, switchMap } from 'rxjs';

type FormField = 'firstName' | 'lastName' | 'email' | 'password';

const ERROR_MESSAGES: Record<FormField, Record<string, string>> = {
  firstName: {
    required: 'First name is required',
  },
  lastName: {
    required: 'Last name is required',
  },
  email: {
    required: 'Email is required',
    pattern: 'Invalid email',
  },
  password: {
    required: 'Password is required',
    minlength: 'Password must be at least 8 characters long',
    pattern: 'Password must contain at least one lowercase and one uppercase letter',
    includesFirstOrLastName: 'Password cannot contain first or last name',
  },
};

/**
 * Regular expression for email validation.
 *
 * @see {@link https://emailregex.com/}
 */
const EMAIL_PATTERN =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

/**
 * Handles the signup process.
 * Must be provided either in the component.
 */
@Injectable()
export class SignupService {
  #users = inject(UsersService);
  #thumbnails = inject(ThumbnailService);
  #fb = inject(FormBuilder).nonNullable;

  // Because validation happens on form control only when status changes, we need to force validation
  // when the form is submitted. This subject is used to trigger the validation.
  #forceValidation = new Subject<void>();

  form = this.#fb.group({
    firstName: this.#fb.control('', [Validators.required]),
    lastName: this.#fb.control('', [Validators.required]),
    email: this.#fb.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
    password: this.#fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])/),
      this.#getPasswordValidator(),
    ]),
  });

  signup() {
    const { firstName, lastName, email } = this.form.getRawValue();

    return this.#thumbnails
      .getThumbnailUrl(lastName?.length)
      .pipe(switchMap((thumbnailUrl) => this.#users.createUser({ firstName, lastName, email, thumbnailUrl })));
  }

  forceValidation() {
    this.#forceValidation.next();
  }

  errorsFor(controlName: 'firstName' | 'lastName' | 'email' | 'password') {
    const control = this.form.get(controlName)!;

    return merge(control.statusChanges, control.valueChanges, this.#forceValidation).pipe(
      map(() => {
        const errors = control?.errors;
        if (!errors) {
          return undefined;
        } else {
          const errorKey = Object.keys(errors)[0];
          return ERROR_MESSAGES[controlName][errorKey];
        }
      }),
    );
  }

  #getPasswordValidator() {
    return (control: AbstractControl) => {
      if (!this.form) {
        return null;
      }

      const { firstName, lastName } = this.form.getRawValue();
      const includesFirstName = control.value.toLowerCase().includes(firstName.toLowerCase());
      const includesLastName = control.value.toLowerCase().includes(lastName.toLowerCase());

      if (includesFirstName || includesLastName) {
        return {
          includesFirstOrLastName: true,
        };
      }

      return null;
    };
  }
}
