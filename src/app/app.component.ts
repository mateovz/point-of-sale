import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './pages/auth/auth.service';
import { Role } from './shared/models/role.interface';
import { User } from './shared/models/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  title:string = 'Punto de venta';
  currentRoute:string;
  user!: User;
  hasRoles!: Role[];
  isActiveSidenav!:boolean;
  private destroy$ = new Subject<any>();

  constructor(
    private authService: AuthService,
    private router: Router
  ){
    this.currentRoute = '/';
  }

  ngOnInit(): void {
    this.authService.getUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user) => (this.user = user)
      );

    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: Event) => {
        if(e instanceof NavigationEnd){
          this.currentRoute = e.url;
        }
      });
  }

  ngOnDestroy():void{
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
