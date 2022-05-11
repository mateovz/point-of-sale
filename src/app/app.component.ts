import { Component, Input, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './pages/auth/auth.service';
import { Role } from './shared/models/role.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title:string = 'Punto de venta';
  currentRoute:string;
  isLogged: boolean = false;
  hasRoles!: Array<Role>;
  isActiveSidenav!:boolean;

  constructor(
    private authService: AuthService,
    private router: Router
  ){
    this.currentRoute = '/';
    this.router.events.subscribe((e: Event) => {
      if(e instanceof NavigationEnd){
        this.currentRoute = e.url;
      }
    })
  }

  ngOnInit(): void {
    this.authService.isLogged.subscribe(
      (res) => (this.isLogged = res)
    )
    this.authService.hasRoles.subscribe(
      (res) => (this.hasRoles = res)
    )
  }
}
