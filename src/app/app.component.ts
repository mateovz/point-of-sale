import { Component, Input, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './pages/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title:string = 'Punto de venta';
  currentRoute:string;
  isLogged: boolean = false;

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
  }
}
