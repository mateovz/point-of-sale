import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { Permission } from '../models/permission.interface';
import { Role } from '../models/role.interface';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: Permission[] = [];

  private destroy$ = new Subject<any>();

  constructor(
    private authService: AuthService,
  ) { 
    this.authService.getUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user) => this.getPermissions(user.roles || [])
      );
  }

  checkPermission(slug: string):boolean{
    if(this.searchSlug('*')) return true;
    if(this.searchSlug(`${slug.split('.')[0]}.*`)) return true;
    if(this.searchSlug(slug)) return true;
    return false;
  }

  private getPermissions(roles: Role[]){
    roles.map((role) => {
      role.permissions.map((permission) => {
        if(!this.searchSlug(permission.slug)){
          this.permissions.push(permission);
        }
      })
    })
  }

  private searchSlug(slug:string):boolean{
    if(this.permissions && this.permissions.find(
      value => value.slug == slug
    )){
      return true;
    }
    return false;
  }
}
