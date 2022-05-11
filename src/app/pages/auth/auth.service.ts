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
        this.saveLocalStorage(res);
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
        this.loggedIn.next(false);
        return res;
      }),
      catchError((error) => this.handlerError(error))
    );
  }

  private checkToken():void{
    const user = localStorage.getItem('user');
    if(user){
      const token:string = JSON.parse(user).token || null;
      if(token){
        this.loggedIn.next(true);
      }else{
        this.loggedIn.next(false);
      }
    }
  }

  private saveLocalStorage(res: LoginResponse):void{
    const token = res.token;
    const {email, name} = res.user;
    const user = {
      token: token,
      email: email,
      name: name
    };

    localStorage.setItem('user', JSON.stringify(user));
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
