import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import zigbee2mqttHu from '../../../../public/i18n/z2m-frontend_Hungarian.json';

@Pipe({ name: 'zigbee2mqttTranslate', pure: true })
export class Zigbee2mqttTranslatePipe implements PipeTransform {
  private zigbee2mqttTranslations: any = zigbee2mqttHu;

  constructor(private translate: TranslateService) {}

  transform(value: string, property?: string): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    if (lang === 'en' || !value) {
      return value;
    }
    // Only use zigbee2mqtt translations for Hungarian
    if (lang === 'hu') {
      if (property && this.zigbee2mqttTranslations[property] && this.zigbee2mqttTranslations[property][value]) {
        return this.zigbee2mqttTranslations[property][value];
      }
    }
    return value;
  }
}
