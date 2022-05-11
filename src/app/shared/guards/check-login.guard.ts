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

  canActivate(): Observable<boolean>{
      return this.authService.isLogged.pipe(
        take(1),
        map((isLogged) => !isLogged)
      )
  }
}
