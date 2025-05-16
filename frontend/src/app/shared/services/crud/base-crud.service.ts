import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { MODEL_PART_NAME } from '../../constants/model-part-name.token';
import { RouteConstants } from '../../route.constants';
import { GeneralHttpResponse } from '../../types/generalHttpResponse';

@Injectable({
  providedIn: 'root',
})
export class CrudService<T> {
  constructor(@Inject(MODEL_PART_NAME) protected modelPartName: string) {
    this.modelPartName = modelPartName;
  }
  protected http = inject(HttpClient);

  public dataChanged: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  public create<R = T, P = T>(item: P): Observable<GeneralHttpResponse<'create', R>> {
    return this.http.post<GeneralHttpResponse<'create', R>>(RouteConstants.CRUD.CREATE(this.modelPartName), item).pipe(
      tap((response) => {
        this.dataChanged.next();
      }),
      catchError((error: GeneralHttpResponse<'create', R>) => of(error))
    );
  }
  public getAll<R = T>(): Observable<GeneralHttpResponse<'get_all', R[]>> {
    return this.http.get<GeneralHttpResponse<'get_all', R[]>>(RouteConstants.CRUD.GET_ALL(this.modelPartName)).pipe(
      catchError((error: GeneralHttpResponse<'get_all', R[]>) => {
        return of(error);
      })
    );
  }

  public update<R = T, P = T>(item: P): Observable<GeneralHttpResponse<'update', R>> {
    return this.http.put<GeneralHttpResponse<'update', R>>(RouteConstants.CRUD.UPDATE(this.modelPartName), item).pipe(
      tap(() => {
        this.dataChanged.next();
      }),
      catchError((error: GeneralHttpResponse<'update', R>) => {
        return of(error);
      })
    );
  }

  public delete<R = T>(id: string): Observable<GeneralHttpResponse<'delete', R>> {
    return this.http.delete<GeneralHttpResponse<'delete', R>>(RouteConstants.CRUD.DELETE(this.modelPartName, id)).pipe(
      tap(() => {
        this.dataChanged.next();
      }),
      catchError((error: GeneralHttpResponse<'delete', R>) => {
        return of(error);
      })
    );
  }
}
