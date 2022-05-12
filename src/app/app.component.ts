import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './pages/auth/auth.service';
import { Role } from './shared/models/role.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  title:string = 'Punto de venta';
  currentRoute:string;
  isLogged: boolean = false;
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
        (user) => (this.isLogged = user.token ? true : false)
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
