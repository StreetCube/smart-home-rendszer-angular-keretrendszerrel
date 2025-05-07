import { Injectable } from '@angular/core';
import { CrudService } from '../../../shared/services/crud/base-crud.service';
import { Room } from '../types/room.types';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends CrudService<Room> {
  constructor() {
    super('Room'); // Specify the model name for CRUD operations
  }
}
