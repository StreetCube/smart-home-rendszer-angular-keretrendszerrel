import { ValidatorFn } from '@angular/forms';

export interface DynamicFormField {
  key: string;
  label?: string;
  type?: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  hidden?: boolean;
  initialValue?: any;
  validators?: ValidatorFn[];
}
