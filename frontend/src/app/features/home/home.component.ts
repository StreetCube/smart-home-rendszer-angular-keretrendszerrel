import { Component } from '@angular/core';
import { RoomSidenavComponent } from '../rooms/components/room-sidenav/room-sidenav.component';

@Component({
  selector: 'app-home',
  imports: [RoomSidenavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
