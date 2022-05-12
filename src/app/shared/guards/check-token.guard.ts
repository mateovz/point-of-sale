import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenGuard implements CanActivate {

  private user!: User;

  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      this.authService.getUser.pipe(
        take(1),
        map((user: User) => this.user = user)
      )
      if(this.user && this.user.token){
        return true;
      }
      this.redirect();
      return false;
  }
  
  redirect(): any{
    this.router.navigate(['login']);
  }
}
