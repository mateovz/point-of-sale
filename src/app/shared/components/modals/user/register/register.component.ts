import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { RolesService } from 'src/app/pages/roles/services/roles.service';
import { UsersService } from 'src/app/pages/users/services/users.service';
import { Role, RoleResponse } from 'src/app/shared/models/role.interface';
import { User, UserRegister, UserResponse } from 'src/app/shared/models/user.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { GeneratePasswordService } from 'src/app/shared/utils/generate-password.service';
import { RegisterData, ResponseMessage } from './interfaces/register.interface';

enum Action {
  UPDATE='update',
  REGISTER='register'
}

@Component({
  selector: 'modal-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  @Input() modalData!: Observable<RegisterData>;
  @Output() updateUsers: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('closeModal') closeModal!: ElementRef;

  registerForm = this.formBuilder.group({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    roles: new FormControl([]),
    avatar: new FormControl(''),
    avatarSource: new FormControl('')
  });

  modalInfo: RegisterData = {
    title: "",
    action: Action.REGISTER,
    roles: []
  };
  resMessage!: ResponseMessage;
  hide: boolean = true;
  changePass: boolean = false;
  roles!: Role[];
  avatar: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private roleService: RolesService,
    private generatePass: GeneratePasswordService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.modalData.subscribe((data: RegisterData) => {
      this.initModal(data);
      if(this.checkPermission('user.change.roles')) this.getRoles();
    });
  }

  getRoles(){
    this.roleService.getAll().subscribe((res: RoleResponse) => {
      if(res.roles) this.roles = res.roles;
    });
  }

  initModal(data: RegisterData):void{
    // reiniciar modal
    this.resMessage = {};
    this.registerForm.reset();
    this.avatar = undefined;
    // titulo
    this.modalInfo.title = data.title;
    // crear o actualizar
    this.modalInfo.action = data.action;
    // actualizar, rellena informacion del usuario
    this.modalInfo.user = {id: data.user?.id};
    if(data.user) this.initialData(data.user);
    // la contraseña al actualizar por defecto no sera modificada
    if(this.modalInfo.action === Action.REGISTER) {
      this.registerForm.get('password')?.enable(); 
    }else{
      this.changePass = false;
      this.registerForm.get('password')?.disable(); 
      // rellena roles
      if(data.roles) this.initialRoles(data.roles);
    }
  }

  initialData(user: User){
    this.registerForm.patchValue({
      name: user.name,
      email: user.email,
    });
  }

  initialRoles(roles: number[]){
    this.modalInfo.roles = roles;
    this.registerForm.get('roles')?.setValue({add: roles, remove: []});
  }

  initialAvatar(avatar: string){

  }

  onSave():void{
    this.resMessage = {};
    if(this.registerForm.valid){
      const userData: UserRegister = this.registerForm.value;
      userData.roles = this.prepareRoles();
      if(this.modalInfo.action === Action.REGISTER){
        this.userService.new(userData).subscribe({
          next: (res) => this.nextHanddler(res),
          error: (err) => this.errorHanddler(err)
        });
      }else{
        const userId = this.modalInfo.user?.id;
        if(userId){
          this.userService.update(userId, userData).subscribe({
            next: (res) => this.nextHanddler(res),
            error: (err) => this.errorHanddler(err)
          });
        }
      }
    }
  }

  nextHanddler(res: UserResponse):void{
    if(this.modalInfo.action === Action.REGISTER){
      this.resMessage = {error: false, message: 'El usuario se ha creado con exito.'};
      this.registerForm.reset();
    }else{
      this.resMessage = {error: false, message: 'El usuario se ha actualizado con exito.'};
      this.closeModal.nativeElement.click();
    }
    this.updateUsers.emit();
    console.log(res);
  }

  errorHanddler(err: any):void{
    console.log(err);
  }

  newPass(){
    const pass = this.generatePass.generate(10);
    this.hide = false;
    this.registerForm.patchValue({password: pass});
  }

  checkedChangePass(){
    this.changePass = !this.changePass;
    const inputPass = this.registerForm.get('password');
    this.registerForm.patchValue({password: ''});
    if(this.changePass){
      inputPass?.enable();
    }else{
      inputPass?.disable();
    }
  }

  onChangeCheckRoles(roleId: any){
    const roles = this.registerForm.get('roles');
    let rolesValue = roles?.value;
    if(!this.findRoleForm(roleId)) {
      rolesValue.add = this.roleService.addRoleId(rolesValue.add, roleId);
      rolesValue.remove = this.roleService.removeRoleId(rolesValue.remove, roleId);
    }else{
      rolesValue.add = this.roleService.removeRoleId(rolesValue.add, roleId);
      if(this.roleService.findRole(this.modalInfo.roles, roleId)){
        rolesValue.remove = this.roleService.addRoleId(rolesValue.remove, roleId);
      }
    }
    roles?.setValue(rolesValue);
  }

  onFileChange(event: any){
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      if(!file.type.match(/image\/*/)){
        this.registerForm.patchValue({
          avatar: '',
          avatarSource: ''
        });
      }
      this.registerForm.patchValue({
        avatarSource: file
      });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.avatar = reader.result;
      }
    }
  }

  findRoleForm(id: any):boolean{
    const roleActive: number[] = this.registerForm.get('roles')?.value?.add;
    return this.roleService.findRole(roleActive, id);
  }

  prepareRoles(){
    const roles = this.registerForm.get('roles');
    let newRoles;
    if(roles) newRoles = this.roleService.prepareDataUser(roles.value);
    return newRoles;
  }

  checkPermission(permission: string):boolean{
    return this.permissionService.checkPermission(permission);
  }
}
