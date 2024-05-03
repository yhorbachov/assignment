import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-text-input',
  template: `
    <label class="form-control w-full">
      @if (label) {
        <div class="label">
          <span data-testid="label-text" class="label-text">{{ label }}</span>
        </div>
      }
      <input
        class="input input-bordered"
        [type]="type"
        [value]="_value"
        (input)="handleInput($event)"
        (blur)="_onTouch()"
        [disabled]="_disabled"
      />
      @if (error) {
        <div data-testid="error-message" class="text-red-500 text-sm pl-2 mt-1">{{ error }}</div>
      }
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextInputComponent,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() error?: any;
  @Input() type: 'text' | 'password' | 'email' = 'text';

  _value = '';
  _disabled = false;

  _onChange!: (value: string) => void;
  _onTouch!: () => void;

  handleInput(evt: Event) {
    this._onChange((evt.target as HTMLInputElement).value);
  }

  writeValue(value: string): void {
    this._value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
}
