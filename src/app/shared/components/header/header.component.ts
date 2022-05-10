import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle!: string;
  isLogged: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.isLogged.subscribe(
      (res) => (this.isLogged = res)
    )
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
