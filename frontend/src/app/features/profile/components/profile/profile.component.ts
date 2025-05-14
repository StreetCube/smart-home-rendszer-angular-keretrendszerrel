import { DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../auth/services/auth.service';
import { LanguageConstants } from '../../../translation/constants/language.constants';
import { LanguageService } from '../../../translation/services/language.service';
import { SupportedLanguage } from '../../../translation/types/language.type';

@Component({
  selector: 'app-profile',
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, MatCardModule, DatePipe, NgClass, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  public languageService = inject(LanguageService);
  public authService = inject(AuthService);

  public languages = Object.values(LanguageConstants.SUPPORTED_LANGUAGES);

  updateLanguage(language: SupportedLanguage) {
    this.languageService.setLanguage(language);
  }

  changePassword() {}
}
