import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() currentRoute!:string;
  @Input() isActiveSidenav!:boolean;

  constructor(
    private permissionService: PermissionService,
  ) { }

  ngOnInit(): void {
  }

  check = (slug:string) => this.permissionService.checkPermission(slug);
}
