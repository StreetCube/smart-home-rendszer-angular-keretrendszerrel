import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieManagerService } from '../../../shared/services/cookie-manager/cookie-manager.service';
import { LanguageConstants } from '../constants/language.constants';
import { Language, SupportedLanguage } from '../types/language.type';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor() {
    this.translateService.addLangs(Object.keys(LanguageConstants.SUPPORTED_LANGUAGES));
    this.translateService.setDefaultLang('en');
    effect(() => {
      this.translateService.use(this.currentLanguage().code);
      this.cookieManagerService.setLanguageCookie(this.currentLanguage().code);
    });
  }

  private cookieManagerService = inject(CookieManagerService);
  private translateService = inject(TranslateService);

  public currentLanguage = signal<Language>(this.getLanguageToUse());

  private getLanguageToUse(): Language {
    const cookieLanguage = this.cookieManagerService.getLanguageCookie();
    const browserLanguage = navigator.language.split('-')[0] as SupportedLanguage;

    return (
      LanguageConstants.SUPPORTED_LANGUAGES[cookieLanguage] ||
      LanguageConstants.SUPPORTED_LANGUAGES[browserLanguage] ||
      LanguageConstants.SUPPORTED_LANGUAGES.en
    );
  }

  public setLanguage(language: SupportedLanguage): void {
    this.currentLanguage.set(LanguageConstants.SUPPORTED_LANGUAGES[language]);
  }
}
