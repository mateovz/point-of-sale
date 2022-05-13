import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import { UserResponse, User, UserLogin } from 'src/app/shared/models/user.interface';
import { Role } from 'src/app/shared/models/role.interface';
import { Permission } from 'src/app/shared/models/permission.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user = new BehaviorSubject<User>({});

  constructor(
    private http: HttpClient,
  ) { 
    this.checkUser();
  }

  get getUser():Observable<User>{
    return this.user.asObservable();
  }

  login(authData: UserLogin):Observable<UserResponse>{
    return this.http.post<UserResponse>(
      `${environment.API_URL}/api/user/login`, 
      authData
    ).pipe(
      map((res: UserResponse) => {
        const user = this.saveLocalStorage(res);
        this.user.next(user);
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
        this.user.next({});
        return res;
      }),
      catchError((error) => this.handlerError(error))
    );
  }

  private checkUser():void{
    const user = localStorage.getItem('user');
    if(user){
      this.user.next(JSON.parse(user));
    }
  }

  private saveLocalStorage(res: UserResponse):User{
    const token = res.token;
    const {email, name} = res.user;
    const user:User = {
      token: token,
      email: email,
      name: name,
      roles: this.getRolesInfo(res.user?.roles)
    };

    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  private getRolesInfo(roles?: Role[]):Role[]{
    const roleInfo: Role[] = [];
    roles?.map(role => {
      roleInfo.push({
        name: role.name,
        description: role.description,
        slug: role.slug,
        permissions: this.getPermissionsInfo(role.permissions),
      });
    });
    return roleInfo;
  }

  private getPermissionsInfo(permissions?: Permission[]):Permission[]{
    const permissionInfo: Permission[] = [];
    permissions?.map(permission => {
      permissionInfo.push({
        name: permission.name,
        slug: permission.slug
      });
    })
    return permissionInfo;
  }

  private handlerError(error:any):Observable<never>{
    let errorMessage;
    if(error) errorMessage = error;
    if(errorMessage.error) errorMessage = errorMessage.error;
    if(!errorMessage) errorMessage = 'unknow';
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
