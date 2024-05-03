import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TextInputComponent } from './text-input.component';
import { By } from '@angular/platform-browser';

describe('[Shared] TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ imports: [TextInputComponent] }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render label', () => {
    component.label = 'First Name';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('[data-testid="label-text"]'));
    expect(label.nativeElement.textContent).toBe('First Name');
  });

  it('should render error message', () => {
    component.error = 'First Name is required';
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
    expect(error.nativeElement.textContent).toBe('First Name is required');
  });

  it('should set input type to text by default', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.type).toBe('text');
  });

  it('should set input type to password', () => {
    component.type = 'password';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.type).toBe('password');
  });

  it('should update input value', () => {
    component.writeValue('John Doe');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.value).toBe('John Doe');
  });

  it('should call onChange method', () => {
    const onChange = jasmine.createSpy();
    component.registerOnChange(onChange);
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'John Doe';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalledWith('John Doe');
  });

  it('should call onTouch method', () => {
    const onTouch = jasmine.createSpy();
    component.registerOnTouched(onTouch);
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('blur'));
    expect(onTouch).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(true);
  });
});
