import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { RouteConstants } from '../../../shared/route.constants';
import { CrudService } from '../../../shared/services/crud/base-crud.service';
import { GeneralHttpResponse } from '../../../shared/types/generalHttpResponse';
import { Product, Product_For_Create } from '../types/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends CrudService<Product> {
  constructor() {
    super('Product');
  }
  inclusionInProgress = signal(false);
  public override dataChanged: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  public include(ForProductCreation: Product_For_Create): Observable<GeneralHttpResponse<'include'>> {
    return this.http.post<GeneralHttpResponse<'include'>>(RouteConstants.DEVICE.INCLUDE, ForProductCreation).pipe(
      tap(() => this.dataChanged.next()),
      catchError((error: GeneralHttpResponse<'include'>) => {
        return of(error);
      })
    );
  }

  public stopInclusion() {
    console.log('stopInclusion');
  }

  public getProductsForRoom(roomId: string): Observable<GeneralHttpResponse<'products_for_room'>> {
    return this.http
      .get<GeneralHttpResponse<'products_for_room'>>(RouteConstants.CRUD.GET_PRODUCTS_FOR_ROOM(roomId))
      .pipe(
        catchError((error: GeneralHttpResponse<'products_for_room'>) => {
          return of(error);
        })
      );
  }

  public sendCommandToDevice(
    ieeeAddress: string,
    property: string,
    value: string
  ): Observable<GeneralHttpResponse<any>> {
    return this.http
      .post<GeneralHttpResponse<any>>(RouteConstants.DEVICE.SEND_COMMAND, { value, ieeeAddress, property })
      .pipe(
        catchError((error: GeneralHttpResponse<any>) => {
          return of(error);
        })
      );
  }
}
