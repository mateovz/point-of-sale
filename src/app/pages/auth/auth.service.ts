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

  private roleDefault: Role = {
    name: 'visitante',
    slug: 'visitor',
    permissions: []
  };

  private loggedIn = new BehaviorSubject<boolean>(false);
  private roles = new BehaviorSubject<Array<Role>>([this.roleDefault]);

  constructor(
    private http: HttpClient,
  ) { 
    this.checkToken();
    this.checkRole();
  }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  get hasRoles():Observable<Array<Role>>{
    return this.roles.asObservable();
  }

  login(authData: UserLogin):Observable<UserResponse>{
    return this.http.post<UserResponse>(
      `${environment.API_URL}/api/user/login`, 
      authData
    ).pipe(
      map((res: UserResponse) => {
        const user = this.saveLocalStorage(res);
        this.loggedIn.next(true);
        this.roles.next(user.roles);
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
        this.roles.next([this.roleDefault]);
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

  private checkRole():void{
    const user = localStorage.getItem('user');
    if(user){
      const roles = JSON.parse(user).roles || null;
      if(roles){
        this.roles.next(roles);
      }else{
        this.roles.next([this.roleDefault]);
      }
    }
  }

  private saveLocalStorage(res: UserResponse):User{
    console.log(res);
    const token = res.token;
    const {email, name} = res.user;
    const user:User = {
      token: token,
      email: email,
      name: name,
      roles: this.getRolesInfo(res.user.roles)
    };

    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  private getRolesInfo(roles: Array<Role>):Array<Role>{
    const roleInfo: Array<Role> = [];
    roles.map(role => {
      roleInfo.push({
        name: role.name,
        description: role.description,
        slug: role.slug,
        permissions: this.getPermissionsInfo(role.permissions),
      });
    });
    return roleInfo;
  }

  private getPermissionsInfo(permissions: Array<Permission>):Array<Permission>{
    const permissionInfo: Array<Permission> = [];
    permissions.map(permission => {
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
    if(errorMessage.errors) errorMessage = errorMessage.errors;
    if(!errorMessage) errorMessage = 'unknow';
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
