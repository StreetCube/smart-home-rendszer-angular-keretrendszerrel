import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription, switchMap } from 'rxjs';
import { DynamicFormDialogComponent } from '../../../../shared/components/create-dialog/create-dialog.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { CreateDialogConstants } from '../../../../shared/constants/create-dialog.constants';
import { TableColumnConstants } from '../../../../shared/constants/table-column.constants';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar.service';
import { ApiCustomCode } from '../../../../shared/types/generalHttpResponse';
import { AuthService } from '../../../auth/services/auth.service';
import { RoomService } from '../../services/room.service';
import { Room, Room_To_Create } from '../../types/Room';

@Component({
  selector: 'app-rooms',
  imports: [TableComponent, MatButtonModule, TranslatePipe, MatDialogModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit, OnDestroy {
  rooms!: Room[];
  roomService = inject(RoomService);
  dialog = inject(MatDialog);
  snackBarService = inject(SnackbarService);
  authService = inject(AuthService);
  columns = TableColumnConstants.COLUMNS['ROOM'];

  subscription?: Subscription;

  ngOnInit(): void {
    this.fetchRoomsData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchRoomsData(): void {
    this.subscription = this.roomService.dataChanged
      .pipe(switchMap(() => this.roomService.getAll()))
      .subscribe((response) => {
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

  openCreateRoomDialog(): void {
    this.dialog
      .open(DynamicFormDialogComponent, {
        data: CreateDialogConstants.CREATE_ROOM(this.authService.user()!.id),
      })
      .afterClosed()
      .subscribe((result: Room_To_Create | undefined) => {
        if (result) {
          this.roomService.create<Room, Room_To_Create>(result).subscribe((response) => {
            if (response && response.data) {
              this.snackBarService.showSuccess('create.room.success');
            } else {
              switch (response.error.code) {
                case ApiCustomCode.ALREADY_EXISTS:
                  this.snackBarService.showError('create.room.already_exists');
                  break;
                default:
                  this.snackBarService.showError('create.room.unknown_error');
                  break;
              }
            }
          });
        }
      });
  }
}
