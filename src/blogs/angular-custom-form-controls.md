---
title: "Angular Signal Forms Custom Controls: Building Reusable Inputs with [formField]"
date: "2026-03-15"
summary: "Learn how to build Angular Signal Forms custom controls with FormValueControl and FormCheckboxControl, bind them with [formField], and keep validation in the latest schema-driven Signal Forms API."
tags: ["Angular", "Forms", "Signals", "Validation", "TypeScript", "Web Development"]
---

# Angular Signal Forms Custom Controls: Building Reusable Inputs with [formField]

Custom form controls have always been one of the most valuable Angular patterns. They let you encapsulate rich UI widgets like quantity steppers, toggles, rating inputs, and nested address forms while still integrating with a parent form. Traditionally, that meant implementing `ControlValueAccessor`.

But Angular's latest **Signal Forms** API introduces a different model. Instead of `NG_VALUE_ACCESSOR`, callback registration, and imperative bridging code, custom controls can now participate in forms through signal-based interfaces like `FormValueControl` and `FormCheckboxControl`, then bind directly with the `[formField]` directive.

If you are building a new signal-first Angular application, this approach is much more natural.

## Important Note

As of **March 15, 2026**, Angular's official docs document Signal Forms under the Angular v21 guides and still describe the API as **experimental**. That makes Signal Forms a strong option for new signal-centric codebases, but not an automatic replacement for existing Reactive Forms applications.

## What Are Signal Forms Custom Controls?

Signal Forms custom controls are Angular components that expose their state using signals instead of the `ControlValueAccessor` contract.

In practice, that means:

- **The control value is a signal** - Usually `value = model(...)` or `checked = model(...)`
- **Control state is exposed as inputs** - `disabled`, `readonly`, `invalid`, and `errors`
- **Touched state is also a signal** - The component can mark itself touched with `touched.set(true)`
- **Binding happens with `[formField]`** - Angular connects the component to a field in the form tree

This gives you a custom control API that feels consistent with the rest of Angular's signal-based architecture.

## Prerequisites

To follow along, you should have:

- **Angular v21 or higher**
- Basic understanding of **Signals**
- Familiarity with the new **Signal Forms** APIs

## Getting Started with the Latest Signal Forms APIs

Signal Forms custom controls currently revolve around two main interfaces:

- **`FormValueControl<T>`** - For value-based controls like text inputs, numeric steppers, and dropdowns
- **`FormCheckboxControl`** - For checkbox-like controls driven by a boolean checked state

The binding point is the `FormField` directive:

```html
<app-seat-stepper [formField]="registrationForm.seats" />
```

That single binding replaces the older `formControlName` + `ControlValueAccessor` integration pattern for Signal Forms.

## Building a Reusable Seat Stepper Control

Let us build a practical example: a workshop registration form with a reusable seat-stepper control. It will:

- Use the latest Signal Forms custom control API
- Bind through `[formField]`
- Surface validation errors from the parent form schema
- Respect `disabled`, `readonly`, and `touched` state

### Step 1: Create a Custom `FormValueControl`

Here is a standalone seat-stepper component using the latest Signal Forms style:

```typescript
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

@Component({
  selector: 'app-seat-stepper',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stepper-card" [class.disabled]="disabled()">
      <label class="stepper-label">{{ label() }}</label>

      <div class="stepper-controls">
        <button
          type="button"
          class="stepper-btn"
          (click)="decrement()"
          [disabled]="disabled() || readonly() || reachedMinimum()"
          aria-label="Decrease seats"
        >
          -
        </button>

        <input
          class="stepper-input"
          type="number"
          [value]="value()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [attr.min]="min() ?? null"
          [attr.max]="max() ?? null"
          [attr.aria-invalid]="invalid()"
          (input)="updateValue($event)"
          (blur)="touched.set(true)"
        />

        <button
          type="button"
          class="stepper-btn"
          (click)="increment()"
          [disabled]="disabled() || readonly() || reachedMaximum()"
          aria-label="Increase seats"
        >
          +
        </button>
      </div>

      @if (invalid() && touched()) {
        <div class="error-box">
          @for (error of errors(); track error.message) {
            <p>{{ error.message }}</p>
          }
        </div>
      }
    </div>
  `
})
export class SeatStepperComponent implements FormValueControl<number> {
  value = model(1);
  touched = model(false);

  readonly = input(false);
  disabled = input(false);
  invalid = input(false);
  required = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  label = input('Seats');
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  step = input(1);

  increment(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const upperBound = this.max() ?? Number.MAX_SAFE_INTEGER;
    this.value.set(Math.min(this.value() + this.step(), upperBound));
    this.touched.set(true);
  }

  decrement(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const lowerBound = this.min() ?? Number.MIN_SAFE_INTEGER;
    this.value.set(Math.max(this.value() - this.step(), lowerBound));
    this.touched.set(true);
  }

  updateValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextValue = input.valueAsNumber;

    if (Number.isNaN(nextValue)) {
      return;
    }

    this.value.set(nextValue);
    this.touched.set(true);
  }

  reachedMinimum(): boolean {
    const min = this.min();
    return min !== undefined && this.value() <= min;
  }

  reachedMaximum(): boolean {
    const max = this.max();
    return max !== undefined && this.value() >= max;
  }
}
```

There is no `ControlValueAccessor`, no provider registration, and no `registerOnChange()` boilerplate. The control participates in the form simply by exposing the expected signal-based contract.

### Step 2: Build a Signal Form Around the Control

Now create a workshop registration form that binds the seat stepper through `[formField]`:

```typescript
import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  max,
  min,
  required,
  submit,
} from '@angular/forms/signals';
import { SeatStepperComponent } from '../seat-stepper/seat-stepper.component';

interface WorkshopRegistration {
  fullName: string;
  emailAddress: string;
  seats: number;
  company: string;
}

@Component({
  selector: 'app-workshop-registration',
  standalone: true,
  imports: [FormField, JsonPipe, SeatStepperComponent],
  template: `
    <div class="registration-container">
      <h2>Workshop Registration</h2>

      <form (submit)="onSubmit($event)">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your name"
            [formField]="registrationForm.fullName"
          />

          @if (registrationForm.fullName().touched() && registrationForm.fullName().invalid()) {
            <div class="error-box">
              @for (error of registrationForm.fullName().errors(); track error.message) {
                <p>{{ error.message }}</p>
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            type="email"
            placeholder="you@example.com"
            [formField]="registrationForm.emailAddress"
          />

          @if (registrationForm.emailAddress().touched() &&
          registrationForm.emailAddress().invalid()) {
            <div class="error-box">
              @for (error of registrationForm.emailAddress().errors(); track error.message) {
                <p>{{ error.message }}</p>
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="company">Company</label>
          <input
            id="company"
            type="text"
            placeholder="Your company"
            [formField]="registrationForm.company"
          />
        </div>

        <div class="form-group">
          <app-seat-stepper
            [formField]="registrationForm.seats"
            [label]="'Number of seats'"
            [step]="1"
          />
        </div>

        <div class="form-summary">
          <h3>Form Status</h3>
          <ul>
            <li>Valid: {{ registrationForm().valid() ? 'Yes' : 'No' }}</li>
            <li>Touched: {{ registrationForm().touched() ? 'Yes' : 'No' }}</li>
            <li>Seats: {{ registrationModel().seats }}</li>
          </ul>
        </div>

        <button type="submit" class="btn-submit">Reserve Seats</button>
      </form>

      <div class="data-preview">
        <h3>Current Model</h3>
        <pre>{{ registrationModel() | json }}</pre>
      </div>
    </div>
  `,
  styleUrl: './workshop-registration.component.css',
})
export class WorkshopRegistrationComponent {
  registrationModel = signal<WorkshopRegistration>({
    fullName: '',
    emailAddress: '',
    seats: 1,
    company: '',
  });

  registrationForm = form(this.registrationModel, (schema) => {
    required(schema.fullName, {
      message: 'Full name is required',
    });

    required(schema.emailAddress, {
      message: 'Email address is required',
    });
    email(schema.emailAddress, {
      message: 'Enter a valid email address',
    });

    min(schema.seats, 1, {
      message: 'At least one seat is required',
    });
    max(schema.seats, 10, {
      message: 'You can reserve at most 10 seats',
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.registrationForm, async () => {
      const payload = this.registrationModel();
      console.log('Submitting registration:', payload);
    });
  }
}
```

The key line is:

```html
<app-seat-stepper [formField]="registrationForm.seats" />
```

That is the latest Signal Forms equivalent of wiring a custom control into a parent form. Notice that the schema-defined `min()` and `max()` constraints are passed into the control automatically by `FormField`, so the parent template does not need to duplicate them.

### Step 3: Add Styling

Use the following CSS to keep the demo polished and readable:

```css
.registration-container {
  max-width: 760px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.registration-container h2,
.registration-container h3 {
  color: #111827;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label,
.stepper-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus,
.stepper-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.stepper-card {
  padding: 1rem;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}

.stepper-card.disabled {
  opacity: 0.6;
}

.stepper-controls {
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  gap: 0.75rem;
  align-items: center;
}

.stepper-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  font-size: 1.25rem;
  cursor: pointer;
}

.stepper-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.stepper-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
}

.error-box {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
}

.error-box p {
  margin: 0.25rem 0;
}

.form-summary,
.data-preview {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f9fafb;
}

.form-summary ul {
  margin: 0.75rem 0 0 0;
  padding-left: 1.25rem;
}

.btn-submit {
  margin-top: 1.5rem;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
}
```

## Key Concepts Explained

### 1. `FormValueControl<T>` Replaces `ControlValueAccessor` for Signal Forms

In classic Angular forms, custom controls bridge themselves to the form system with:

- `writeValue()`
- `registerOnChange()`
- `registerOnTouched()`
- `NG_VALUE_ACCESSOR`

In Signal Forms, that bridge becomes much simpler:

```typescript
export class SeatStepperComponent implements FormValueControl<number> {
  value = model(1);
  touched = model(false);

  disabled = input(false);
  readonly = input(false);
  invalid = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
```

That is the core mental shift: the form connects to your control through signals, not callbacks.

### 2. `[formField]` Is the New Binding Mechanism

Signal Forms do not use `formControlName` or `ngModel` for these examples. Instead, the field itself is bound directly:

```html
<input [formField]="registrationForm.fullName" />
<app-seat-stepper [formField]="registrationForm.seats" />
```

The same directive works for both native elements and custom controls, which makes form templates much more consistent.

### 3. Validation Lives in the Form Schema

One of the biggest improvements in Signal Forms is that validation remains centered in the schema:

```typescript
registrationForm = form(this.registrationModel, (schema) => {
  required(schema.fullName, { message: 'Full name is required' });
  email(schema.emailAddress, { message: 'Enter a valid email address' });
  min(schema.seats, 1, { message: 'At least one seat is required' });
  max(schema.seats, 10, { message: 'You can reserve at most 10 seats' });
});
```

This keeps the parent form as the source of truth for business rules, while the custom control stays focused on presentation and interaction.

### 4. Touched State Is Explicit

The control decides when user interaction should mark the field as touched:

```typescript
(blur)="touched.set(true)"
```

or:

```typescript
this.touched.set(true);
```

That is a lot easier to reason about than manually coordinating `onTouched()` callbacks.

### 5. Error Rendering Uses the Field Tree

The custom control can render errors directly from the bound field state:

```typescript
errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
```

Then in the template:

```html
@if (invalid() && touched()) {
  @for (error of errors(); track error.message) {
    <p>{{ error.message }}</p>
  }
}
```

This lets the parent own validation while the child owns the presentation of those errors.

## Advanced Features

### Checkbox-style Controls Use `FormCheckboxControl`

If your control represents a boolean checked state instead of a generic value, use `FormCheckboxControl`:

```typescript
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'app-terms-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="toggle"
      [class.on]="checked()"
      [disabled]="disabled() || readonly()"
      (click)="toggle()"
    >
      {{ checked() ? 'Accepted' : 'Accept Terms' }}
    </button>
  `,
})
export class TermsToggleComponent implements FormCheckboxControl {
  checked = model(false);
  touched = model(false);

  readonly = input(false);
  disabled = input(false);

  toggle(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    this.checked.set(!this.checked());
    this.touched.set(true);
  }
}
```

The important distinction is that checkbox-like controls expose `checked`, not `value`.

### Transform Display Values with `linkedSignal`

One of the most useful patterns in the official guide is transforming the display value while keeping the underlying form value clean. For example, you can expose a numeric model but format it as currency:

```typescript
import { ChangeDetectionStrategy, Component, linkedSignal, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-budget-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input [value]="formattedBudget()" (input)="onInput($event)" />
  `,
})
export class BudgetInputComponent implements FormValueControl<number> {
  value = model(0);
  touched = model(false);

  formattedBudget = linkedSignal(() => `$${this.value().toFixed(2)}`);

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/[^0-9.]/g, '');
    const parsed = Number(raw);

    if (!Number.isNaN(parsed)) {
      this.value.set(parsed);
      this.touched.set(true);
    }
  }
}
```

This is much cleaner than mixing parsing and formatting logic into the parent form.

### Mix Native Controls and Custom Controls in the Same Form

Signal Forms make this especially clean because both use the same binding directive:

```html
<input [formField]="registrationForm.fullName" />
<input [formField]="registrationForm.emailAddress" />
<app-seat-stepper [formField]="registrationForm.seats" />
```

That consistency is one of the strongest advantages of the new API.

## Best Practices

### 1. Keep Business Validation in the Schema

Prefer this:

```typescript
min(schema.seats, 1, { message: 'At least one seat is required' });
max(schema.seats, 10, { message: 'You can reserve at most 10 seats' });
```

Instead of scattering business rules across multiple components.

### 2. Keep the Control Focused on UI Behavior

The custom control should usually own:

- How the value is displayed
- How interaction changes the value
- When touched state is set
- How field errors are rendered

It should usually not own the full business validation story.

### 3. Implement the Correct Interface for the Control Type

Use:

- `FormValueControl<T>` for value-driven controls
- `FormCheckboxControl` for checkbox-like controls

Picking the wrong interface creates unnecessary friction in both the component API and the template.

### 4. Respect `disabled()` and `readonly()`

A good custom control should feel native inside the form. That means every interaction path should guard against disabled and read-only states:

```typescript
if (this.disabled() || this.readonly()) {
  return;
}
```

### 5. Use Signal Forms Only Where the Tradeoff Makes Sense

Signal Forms are compelling, but the experimental status still matters. For an established Reactive Forms codebase, rewriting everything to the new API is rarely justified.

## Comparison: `ControlValueAccessor` vs Signal Forms Custom Controls

| Feature | `ControlValueAccessor` | Signal Forms Custom Controls |
|---------|------------------------|------------------------------|
| Primary binding | `formControlName` / `ngModel` | `[formField]` |
| Integration style | Callback-based | Signal-based |
| Registration | `NG_VALUE_ACCESSOR` provider | Implement control interface |
| Touched handling | `registerOnTouched()` callback | `touched = model(false)` |
| Validation flow | Validators + CVA patterns | Schema-driven field validation |
| Best fit | Existing Reactive Forms apps | New signal-first Angular apps |
| Stability | Mature | Experimental as of Angular v21 |

## When to Use Signal Forms Custom Controls

**Use them when:**

- You are building a new Angular v21+ application
- Your form architecture is already signal-first
- You want validation centralized in a schema
- You prefer signal-based state over callback-driven bridging
- You want a consistent `[formField]` story for native and custom inputs

**Avoid them when:**

- Your application is already built around Reactive Forms
- Stability matters more than API modernity
- Your team is not ready to adopt experimental Angular APIs
- You need seamless compatibility with existing `ControlValueAccessor`-based component libraries

## Conclusion

Angular's latest Signal Forms API makes custom form controls significantly cleaner than the traditional `ControlValueAccessor` model. Instead of registering callbacks and providers, you expose value and state through signals, bind with `[formField]`, and let the parent schema remain the source of truth for validation.

For new Angular applications, that results in a much more coherent mental model. The seat-stepper example here is simple, but the same pattern scales to toggles, ratings, date inputs, nested object editors, and other reusable form widgets. The main caveat is still the same one documented by Angular today: Signal Forms are powerful, but they remain experimental.

## Resources

- [Angular Signal Forms Custom Controls Guide](https://angular.dev/guide/forms/signals/custom-controls)
- [Angular Signal Forms Overview](https://angular.dev/guide/forms/signals/overview)
- [Angular Signal Forms Validation Guide](https://angular.dev/guide/forms/signals/validation)
- [Angular University: Angular Custom Form Controls](https://blog.angular-university.io/angular-custom-form-controls/)

---

*If you have been building Angular custom controls with `ControlValueAccessor`, Signal Forms are worth studying now even if you do not adopt them immediately. The API direction is much clearer for signal-first applications.*
