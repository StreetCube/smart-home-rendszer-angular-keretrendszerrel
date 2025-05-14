import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { RouteConstants } from '../../../shared/route.constants';
import { CrudService } from '../../../shared/services/crud/base-crud.service';
import { GeneralHttpResponse } from '../../../shared/types/generalHttpResponse';
import { Room } from '../types/Room';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends CrudService<Room> {
  constructor() {
    super('Room'); // Specify the model name for CRUD operations
  }

  public override dataChanged: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  public getRoomsWithProductNumbers(): Observable<GeneralHttpResponse<'room_with_product_numbers'>> {
    return this.http
      .get<GeneralHttpResponse<'room_with_product_numbers'>>(RouteConstants.CRUD.ROOM_WITH_PRODUCT_NUMBERS)
      .pipe(
        catchError((error: GeneralHttpResponse<'room_with_product_numbers'>) => {
          return of(error);
        })
      );
  }
}
