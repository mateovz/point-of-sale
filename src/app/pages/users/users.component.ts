import { Component, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RegisterData } from 'src/app/shared/components/modals/user/register/interfaces/register.interface';
import { User, UserResponse } from 'src/app/shared/models/user.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { UsersService } from './services/users.service';

enum Action {
  UPDATE='update',
  REGISTER='register'
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @HostBinding('class') class = 'flex-fill';

  columns: string[] = ['#', 'Nombre', 'Email', 'Roles', 'Acciones'];
  users!: User[];
  modalData: Subject<RegisterData> = new Subject<RegisterData>();

  constructor(
    private userService: UsersService,
    private permissionService: PermissionService,
  ) { 
    
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.userService.getAll().subscribe((res: UserResponse) => this.users = res.users);
  }

  onRegisterModal(){
    this.modalData.next({
      title:'Nuevo usuario',
      action: Action.REGISTER
    });
  }

  onUpdateModal(user: User){
    this.modalData.next({
      title:'Actualizar usuario',
      action: Action.UPDATE,
      user: user
    });
  }

  check = (slug:string) => this.permissionService.checkPermission(slug);
}
