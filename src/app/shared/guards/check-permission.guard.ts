import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionService } from '../services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private permissionService: PermissionService,
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      const slug = route.data['slug'];
      if(this.permissionService.checkPermission(slug)){
        return true;
      }
      this.redirect();
      return false;
  }

  redirect(){
    this.router.navigate(['']);
  }
  
}
