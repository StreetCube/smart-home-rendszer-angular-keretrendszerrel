import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-room-sidenav',
  imports: [MatSidenavModule, MatCardModule, NgScrollbarModule],
  templateUrl: './room-sidenav.component.html',
  styleUrl: './room-sidenav.component.scss',
})
export class RoomSidenavComponent {}
