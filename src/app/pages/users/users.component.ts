import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Role } from 'src/app/shared/models/role.interface';
import { User, UserResponse } from 'src/app/shared/models/user.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { RegisterData } from './modals/register/interfaces/register.interface';
import { UsersService } from './services/users.service';

enum Action {
  UPDATE='update',
  REGISTER='register'
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @HostBinding('class') class = 'flex-fill';
  @ViewChild('registerModal') registerModal : any;

  public columns: string[] = ['#', 'Nombre', 'Email', 'Roles', 'Acciones'];
  public users!: User[];
  public modalData: Subject<RegisterData> = new Subject<RegisterData>();

  public chargeTable = new Subject<User[]>();

  constructor(
    private userService: UsersService,
    private permissionService: PermissionService,
    private modalService: NgbModal,
  ) { 
    
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.userService.getAll().subscribe((res: UserResponse) => {
      this.users = res.users;
      this.chargeTable.next(this.users);
    });
  }

  onRegisterModal(){
    this.modalData.next({
      title:'Nuevo usuario',
      action: Action.REGISTER
    });
    this.openModal();
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
    this.openModal();
  }

  openModal(){
    this.modalService.open(this.registerModal);
  }

  closeModal(){
    this.modalService.dismissAll();
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
