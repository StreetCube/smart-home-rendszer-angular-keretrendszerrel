import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderMainComponent } from './features/header/components/header-main/header-main.component';
import { LanguageService } from './features/translation/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderMainComponent, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private languageService = inject(LanguageService);
}
