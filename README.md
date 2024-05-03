# Assignment

Simple SPA to immitate signup process. Consists of one page with signup form.

## Technical decissions

I mostly used vanila angular with Tailwind+DaisyUI for styling.

For testing purpouses I included `@hirez_io/observer-spy` library to test observables, everything else is prety much vanila angular.

All signup business logic you can find in the `shared/services/signup.service`, including form validation and error messages. For simplisity sake I kept error messages there, but in real world application probably it would be better to move it into `pipe` and provide error messages values as injection token.

## Projects structure

### Core

- Services
  - ThumbnailService - handles data access to thumbnails API
  - UsersService - handles data access to users API
- Tokens
  - API_BASE - injectable API base url

### Shared

- Components
  - TextInput - ControlValueAccessor implementation to integrate into angular forms
- Services
  - SignupService - Contains business logic for signup process.

### Signup (feature)

Dedicated component for signup process. Displays the form and uses SignupService

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
