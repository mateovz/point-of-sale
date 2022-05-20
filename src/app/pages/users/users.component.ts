import { Component, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RegisterData } from 'src/app/shared/components/modals/user/register/interfaces/register.interface';
import { Role } from 'src/app/shared/models/role.interface';
import { User, UserResponse } from 'src/app/shared/models/user.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { environment } from 'src/environments/environment';
import { UsersService } from './services/users.service';

enum Action {
  UPDATE='update',
  REGISTER='register'
}

enum View{
  TABLE='table',
  CARDS='cards',
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @HostBinding('class') class = 'flex-fill';

  columns: string[] = ['#', 'Avatar', 'Nombre', 'Email', 'Roles', 'Acciones'];
  users!: User[];
  modalData: Subject<RegisterData> = new Subject<RegisterData>();
  
  public view: string = View.CARDS;
  public path: string = environment.API_URL;
  
  private avatarDefault = '/storage/avatars/default.svg';

  constructor(
    private userService: UsersService,
    private permissionService: PermissionService,
  ) { 
    
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.userService.getAll().subscribe((res: UserResponse) => {
      this.users = res.users.map(user => {
        if(!user.avatar) {
          user.avatar = this.path+this.avatarDefault;
        }else{
          user.avatar = this.path+user.avatar;
        }
        return user;
      })
    });
  }

  onRegisterModal(){
    this.modalData.next({
      title:'Nuevo usuario',
      action: Action.REGISTER
    });
  }

  onUpdateModal(user: User){
    //solo se pasan los id de los roles
    let roleIds: any[] = [];
    user.roles?.map((role: Role) => roleIds.push(role.id));

    this.modalData.next({
      title:'Actualizar usuario',
      action: Action.UPDATE,
      user: user,
      roles: roleIds
    });
  }

  onDelete(user: User){
    if(user.id){
      this.userService.delete(user.id).subscribe((res) => {
        this.getUsers();
      })
    }
  }

  check = (slug:string) => this.permissionService.checkPermission(slug);
}
