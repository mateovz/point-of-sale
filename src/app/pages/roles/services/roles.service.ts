import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RoleResponse } from 'src/app/shared/models/role.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private path = `${environment.API_URL}/api/role`;

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

  addRoleId(roleIds: any, id: number):number[]{
    if(!roleIds){
      roleIds = [];
    }
    if(!roleIds.find((roleId: any) => roleId == id)){
      roleIds.push(id);
    }
    return roleIds;
  }

  removeRoleId(roleIds: any, id: number):number[]{
    if(!roleIds){
      roleIds = [];
    }
    return roleIds.filter((role: number) => {
      return role !== id;
    });
  }
  
  findRole(roles: any, id: any):boolean{
    if(roles && roles.find((roleId: any) => roleId == id)) return true;
    return false;
  }

  prepareDataUser(roles: any): any{
    const add: any[] = [];
    const remove: any[] = [];
    if(roles){
      roles.add?.map((role: any) => {
        add.push({id: role});
      });
      roles.remove?.map((role:any) => {
        remove.push({id: role});
      });
    }
    return {add: add, remove: remove};
  }
}
