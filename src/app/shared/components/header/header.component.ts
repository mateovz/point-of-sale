import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle!: string;
  @Input() isLogged!: boolean;
  @Output() toggleSidenav = new EventEmitter<boolean>();

  isActiveSidenav: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.onToggleSidenav();
  }

  onToggleSidenav():void{
    this.isActiveSidenav=!this.isActiveSidenav;
    this.toggleSidenav.emit(this.isActiveSidenav);
  }

  onLogout():void{
    this.authService.logout().subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/login']);
      }
    )
  }

  
}
