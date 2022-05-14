import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User, UserResponse } from 'src/app/shared/models/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) { }

  getAll():Observable<UserResponse>{
    return this.http.get<UserResponse>(
      `${environment.API_URL}/api/user`
    ).pipe(catchError(this.handdleError));
  }
  
  getById(userId:number):Observable<UserResponse>{
    return this.http.get<UserResponse>(
      `${environment.API_URL}/api/user/${userId}`
    ).pipe(catchError(this.handdleError));
  }

  new(user: User):Observable<UserResponse>{
    return this.http.post<UserResponse>(
      `${environment.API_URL}/api/user/register`,
      user
    ).pipe(catchError(this.handdleError));
  }

  update(userId: number, user: User):Observable<UserResponse>{
    return this.http.put<UserResponse>(
      `${environment.API_URL}/api/user/${userId}`,
      user
    ).pipe(catchError(this.handdleError));
  }

  delete(userId: number):Observable<UserResponse>{
    return this.http.delete<UserResponse>(
      `${environment.API_URL}/api/user/${userId}`
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
