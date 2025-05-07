import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TableColumnConstants } from '../../../../shared/constants/table-column.constants';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-rooms',
  imports: [TableComponent, MatButtonModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit {
  rooms!: any[];
  roomService = inject(RoomService);
  columns = TableColumnConstants.COLUMNS['ROOM'];

  ngOnInit(): void {
    this.fetchRoomsData();
  }

  private fetchRoomsData(): void {
    this.roomService.getAll().subscribe((response) => {
      if (response && response.data) {
        this.rooms = response.data;
      } else {
        console.error('Error fetching rooms data:', response);
      }
    });
  }

  viewDevices(room: any): void {
    console.log('Viewing devices for room:', room);
  }

  editRoom(room: any): void {
    console.log('Editing room:', room);
  }

  deleteRoom(room: any): void {
    console.log('Deleting room:', room);
  }

  handleRoomAction(event: { action: string; item: any }): void {
    console.log('Action:', event.action, 'Room:', event.item);
  }

  onRoomClick(room: any): void {
    console.log('Room clicked:', room);
  }
}
