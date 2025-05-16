import { animate, query, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { TranslatePipe } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Subscription } from 'rxjs';
import { ResponsiveService } from '../../../../shared/services/responsive/responsive.service';
import { RoomService } from '../../services/room.service';
import { RoomWithProductNumbers } from '../../types/Room';
import { RoomComponent } from '../room/room.component';

@Component({
  selector: 'app-room-sidenav',
  imports: [
    MatSidenavModule,
    MatCardModule,
    NgScrollbarModule,
    TranslatePipe,
    RoomComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
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
export class RoomSidenavComponent implements OnInit, OnDestroy {
  public roomsWithProductNumbers: RoomWithProductNumbers[] = [];
  private roomService = inject(RoomService);
  private responsiveService = inject(ResponsiveService);
  private responsiveSub!: Subscription;
  public selectedRoom: RoomWithProductNumbers | null = null;
  public sidenavOpened = false;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  public sidenavMode: 'over' | 'side' = 'side';

  ngOnInit(): void {
    this.roomService.getRoomsWithProductNumbers().subscribe((response) => {
      if (response.code === 200 && response.data) {
        this.roomsWithProductNumbers = response.data;
        this.selectRoom(this.roomsWithProductNumbers[0]);
      }
    });
    this.responsiveSub = this.responsiveService.isMobile().subscribe((isMobile) => {
      if (isMobile) {
        this.sidenavMode = 'over';
        this.sidenavOpened = false;
      } else {
        this.sidenavMode = 'side';
        this.sidenavOpened = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.responsiveSub.unsubscribe();
  }

  public selectRoom(room: RoomWithProductNumbers): void {
    console.log(this.sidenavMode);
    if (this.sidenavMode === 'over') {
      this.sidenav.close();
    }
    this.selectedRoom = room;
  }
}
