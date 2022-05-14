import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RoleResponse } from 'src/app/shared/models/role.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private path = `${environment.API_URL}/api/roles`;

  constructor(
    private http: HttpClient,
  ) { }

  getAll(){
    return this.http.get<RoleResponse>(
      `${this.path}`
    ).pipe(catchError(this.handdleError));
  }

  handdleError(error:any):Observable<never>{
    let errorMessage;
    if(error) errorMessage = error;
    if(errorMessage.error) errorMessage = errorMessage.error;
    if(errorMessage.errors) errorMessage = errorMessage.errors;
    if(!errorMessage) errorMessage = 'unknow';
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
