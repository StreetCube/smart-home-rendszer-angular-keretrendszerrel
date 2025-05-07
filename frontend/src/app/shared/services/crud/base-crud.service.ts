import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
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
  private http = inject(HttpClient);

  // public create(item: T): Observable<T & EntityMetadata & { hubId: UUID }> {
  //   return this.http.post<T & EntityMetadata & { hubId: UUID }>(ApiV1Constants.Crud.CREATE(this.modelPartName), item);
  // }

  public getAll<R = T>(): Observable<GeneralHttpResponse<'get_all', R[]>> {
    return this.http.get<GeneralHttpResponse<'get_all', R[]>>(RouteConstants.CRUD.GET_ALL(this.modelPartName)).pipe(
      catchError((error: GeneralHttpResponse<'get_all', R[]>) => {
        return of(error);
      })
    );
  }
}
