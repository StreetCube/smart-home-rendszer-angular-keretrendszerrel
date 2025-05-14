import { ValidatorFn } from '@angular/forms';

export interface DynamicFormField {
  key: string;
  label?: string;
  type?: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  options?: { value: string; label: string }[]; // For select
  hidden?: boolean; // If true, don't display but keep in form
  initialValue?: any;
  validators?: ValidatorFn[]; // <-- Add this line
}
