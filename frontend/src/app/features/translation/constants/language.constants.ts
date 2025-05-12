import { Language, SupportedLanguage } from '../types/language.type';

export class LanguageConstants {
  private constructor() {}

  public static SUPPORTED_LANGUAGES: { [key in SupportedLanguage]: Language } = {
    en: {
      code: 'en',
      name: 'English',
    },
    hu: {
      code: 'hu',
      name: 'Magyar',
    },
  };
}

export const errorCodeMap: Record<number | string, string> = {
  1001: 'errors.invalid_user_pass',
  1002: 'errors.user_not_found',
  default_error: 'errors.default_error',
};
