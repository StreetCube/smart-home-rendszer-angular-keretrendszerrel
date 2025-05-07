import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { GeneralCustomCode } from '../../../shared/types/generalHttpResponse';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);

  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  private authService = inject(AuthService);
  private snackBarService = inject(SnackbarService);
  private router = inject(Router);

  hidePassword = true;
  loginError = false;

  submit() {
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        switch (response.code) {
          case GeneralCustomCode.SUCCESS:
            this.snackBarService.showSuccess('Login successful! Redirecting...');
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
