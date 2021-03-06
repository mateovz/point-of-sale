import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ){
    
  }

  canActivate(): Observable<boolean> | boolean{
    const user = localStorage.getItem('user');
    if(!user) return true;
    if(!JSON.parse(user).token) return false;
      return this.authService.getUser.pipe(
        take(1),
        map((user) => !(user.token))
      )
  }
}
