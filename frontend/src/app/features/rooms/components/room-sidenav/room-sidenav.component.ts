import { animate, query, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslatePipe } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RoomService } from '../../services/room.service';
import { RoomWithProductNumbers } from '../../types/Room';
import { RoomComponent } from '../room/room.component';

@Component({
  selector: 'app-room-sidenav',
  imports: [MatSidenavModule, MatCardModule, NgScrollbarModule, TranslatePipe, RoomComponent, CommonModule],
  animations: [
    trigger('roomTransition', [
      transition(':increment', [
        query(':leave', [animate('200ms ease', style({ opacity: 0 }))], { optional: true }),
        query(
          ':enter',
          [
            style({ transform: 'translateX(40px)', opacity: 0 }),
            animate('300ms 100ms cubic-bezier(.35,0,.25,1)', style({ transform: 'none', opacity: 1 })),
          ],
          { optional: true }
        ),
      ]),
      transition(':decrement', [
        query(':leave', [animate('200ms ease', style({ opacity: 0 }))], { optional: true }),
        query(
          ':enter',
          [
            style({ transform: 'translateX(-40px)', opacity: 0 }),
            animate('300ms 100ms cubic-bezier(.35,0,.25,1)', style({ transform: 'none', opacity: 1 })),
          ],
          { optional: true }
        ),
      ]),
      transition('* <=> *', [
        query(':leave', [animate('200ms ease', style({ opacity: 0 }))], { optional: true }),
        query(
          ':enter',
          [style({ opacity: 0 }), animate('300ms 100ms cubic-bezier(.35,0,.25,1)', style({ opacity: 1 }))],
          { optional: true }
        ),
      ]),
    ]),
  ],
  templateUrl: './room-sidenav.component.html',
  styleUrl: './room-sidenav.component.scss',
})
export class RoomSidenavComponent implements OnInit {
  public roomsWithProductNumbers: RoomWithProductNumbers[] = [];
  private roomService = inject(RoomService);
  public selectedRoom: RoomWithProductNumbers | null = null;

  ngOnInit(): void {
    this.roomService.getRoomsWithProductNumbers().subscribe((response) => {
      if (response.code === 200 && response.data) {
        this.roomsWithProductNumbers = response.data;
        this.selectRoom(this.roomsWithProductNumbers[0]);
      }
    });
  }

  public selectRoom(room: RoomWithProductNumbers): void {
    this.selectedRoom = room;
  }
}
