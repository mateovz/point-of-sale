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
  hasRoles!: Array<Role>;
  isActiveSidenav!:boolean;
  private destroy$ = new Subject<any>();

  constructor(
    private authService: AuthService,
    private router: Router
  ){
    this.currentRoute = '/';
  }

  ngOnInit(): void {
    this.authService.isLogged
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => (this.isLogged = res)
      );

    this.authService.hasRoles
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => (this.hasRoles = res)
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
