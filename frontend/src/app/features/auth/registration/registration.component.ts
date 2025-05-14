import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { GeneralCustomCode } from '../../../shared/types/generalHttpResponse';
import { AuthService } from '../services/auth.service';
import { passwordMatchValidator } from '../validator/passwordMatchValidator';

@Component({
  selector: 'app-registration',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  hidePassword: boolean = true;
  private authService = inject(AuthService);
  private fb = inject(NonNullableFormBuilder);
  private snackBarService = inject(SnackbarService);
  private router = inject(Router);

  registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator() }
  );

  ngOnInit(): void {}

  // Submit handler
  submit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.getRawValue()).subscribe({
        next: (response) => {
          switch (response.code) {
            case GeneralCustomCode.CREATED:
              this.snackBarService.showSuccess('auth.registration.success');
              this.router.navigate(['/home']);
              break;

            default:
              this.snackBarService.showError(response.error.message);
              break;
          }
        },
      });
    }
  }
}
