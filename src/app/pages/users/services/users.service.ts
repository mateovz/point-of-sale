import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User, UserRegister, UserResponse } from 'src/app/shared/models/user.interface';
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

  new(user: UserRegister):Observable<UserResponse>{
    const formData = new FormData();
    if(user.avatarSource) formData.append('avatar', user.avatarSource);
    formData.append('userData', this.prepareData(user));
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data');
    return this.http.post<UserResponse>(
      `${environment.API_URL}/api/user/register`,
      formData, {headers: headers}
    ).pipe(catchError(this.handdleError));
  }

  update(userId: number, user: UserRegister):Observable<UserResponse>{
    const formData = new FormData();
    if(user.avatarSource) formData.append('avatar', user.avatarSource);
    formData.append('userData', this.prepareData(user));
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data');
    return this.http.post<UserResponse>(
      `${environment.API_URL}/api/user/${userId}`,
      formData, {headers: headers}
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

  prepareData(user: UserRegister):string{
    const newData: User = {
      name: user.name,
      email: user.email,
      roles: user.roles
    };
    if(user.password) newData.password = user.password;
    return JSON.stringify(newData);    
  }
}
