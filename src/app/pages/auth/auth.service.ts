import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LoginResponse, UserLogin } from 'src/app/shared/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
  ) { 
    this.checkToken();
  }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  login(authData: UserLogin):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(
      `${environment.API_URL}/api/user/login`, 
      authData
    ).pipe(
      map((res: LoginResponse) => {
        this.saveToken(res.token);
        this.loggedIn.next(true);
        return res;
      }),
      catchError((error) => this.handlerError(error))
    )
  }

  logout():Observable<any | void>{
    return this.http.post(
      `${environment.API_URL}/api/user/logout`,
      {}
    ).pipe(
      map(res => {
        localStorage.removeItem('token');
        this.loggedIn.next(false);
        return res;
      }),
      catchError((error) => this.handlerError(error))
    );
  }

  private checkToken():void{
    const token = localStorage.getItem('token');
    if(token){
      this.loggedIn.next(true);
    }else{
      this.loggedIn.next(false);
    }
  }

  private saveToken(token: string):void{
    localStorage.setItem('token', token);
  }

  private handlerError(error:any):Observable<never>{
    let errorMessage;
    if(error){
      errorMessage = error;
      if(errorMessage.error) errorMessage = errorMessage.error;
      if(errorMessage.errors) errorMessage = errorMessage.errors;
      console.log(errorMessage);
    }
    return throwError(errorMessage);
  }
}
