import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenGuard implements CanActivate {

  constructor(
    private router: Router,
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const cookie = localStorage.getItem('token');
      if(cookie){
        return true;
      }
      this.redirect();
      return false;
  }
  
  redirect(): any{
    this.router.navigate(['/', 'login']);
  }
}
