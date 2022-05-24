import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Role } from 'src/app/shared/models/role.interface';
import { User, UserResponse } from 'src/app/shared/models/user.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { environment } from 'src/environments/environment';
import { RegisterData } from './component/register-modal/interfaces/register.interface'; 
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
  public modalData!: RegisterData;

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
      this.users = res.users.map(user => {
        if(user.avatar) user.avatar = environment.API_URL+user.avatar
        return user;
      });
      this.chargeTable.next(this.users);
    });
  }

  onRegisterModal(){
    this.modalData = {
      title:'Nuevo usuario',
      action: Action.REGISTER
    };
    this.openModal();
  }

  onUpdateModal(user: User){
    this.modalData = {
      title:'Actualizar usuario',
      action: Action.UPDATE,
      user: user
    };
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
