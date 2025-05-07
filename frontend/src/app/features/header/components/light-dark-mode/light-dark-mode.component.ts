import { DOCUMENT } from '@angular/common';
import { Component, inject, Renderer2 } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-light-dark-mode',
  imports: [ButtonModule],
  templateUrl: './light-dark-mode.component.html',
  styleUrl: './light-dark-mode.component.scss',
})
export class LightDarkModeComponent {
  isDarkMode = false;

  constructor() {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const element = document.querySelector('html')!;
    if (this.isDarkMode) {
      element.classList.add('dark-theme');
    } else {
      element.classList.remove('dark-theme');
    }
  }
}
