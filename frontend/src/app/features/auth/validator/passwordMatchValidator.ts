import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordKey: string = 'password',
  confirmPasswordKey: string = 'confirmPassword'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get(passwordKey);
    const confirmPasswordControl = group.get(confirmPasswordKey);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}
