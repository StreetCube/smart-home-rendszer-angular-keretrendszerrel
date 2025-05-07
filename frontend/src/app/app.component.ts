import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderMainComponent } from './features/header/components/header-main/header-main.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderMainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
