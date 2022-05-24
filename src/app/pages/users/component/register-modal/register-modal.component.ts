import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RolesService } from 'src/app/pages/roles/services/roles.service';
import { Role, RoleResponse } from 'src/app/shared/models/role.interface';
import { User, UserRegister, UserResponse } from 'src/app/shared/models/user.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { BaseForm } from 'src/app/shared/utils/base-form';
import { GeneratePasswordService } from 'src/app/shared/utils/generate-password.service';
import { UsersService } from '../../services/users.service';
import { RegisterData, ResponseMessage } from './interfaces/register.interface';

enum Action{
  UPDATE = 'update',
  REGISTER = 'register'
};

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit, OnDestroy {

  @Input() data!: RegisterData;
  @Output() updateUsers: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  
  public action = Action.REGISTER;
  public avatar!: string | ArrayBuffer | undefined;
  public changePass:boolean = true;
  public user!: User;
  public roles!: Role[];
  public hide: boolean = true;
  
  private baseRoles!: any[];
  private subscriptions = new Subscription();

  constructor(
    public form: BaseForm,
    private formBuilder: FormBuilder,
    private roleService: RolesService,
    private userService: UsersService,
    private permissionService: PermissionService,
    private generatePass: GeneratePasswordService,
    private dropdownConfig: NgbDropdownConfig,
  ) { 
    dropdownConfig.autoClose = false;
  }

  ngOnInit(): void { 
    this.initForm();
    if(this.permissionService.checkPermission('user.change.roles')) this.getRoles();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getRoles():void{
    this.subscriptions.add(
      this.roleService.getAll().subscribe((res: RoleResponse) => {
        if(res.roles) this.roles = res.roles;
      })
    );
  }

  private initForm(){
    this.form.baseForm = this.formBuilder.group({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      roles: new FormControl([]),
      avatar: new FormControl(''),
      avatarSource: new FormControl('')
    });

    this.setAction();
  }

  private setAction():void{
    if(this.data.action === Action.UPDATE && this.data?.user?.hasOwnProperty('id')){
      this.action = Action.UPDATE;
      this.patchFormData(this.data.user);
      this.changePass = false;
      this.form.baseForm.get('password')?.disable();
    }else{
      this.action = Action.REGISTER;
      this.form.baseForm.get('password')?.enable(); 
    }
  }

  private patchFormData(user: User):void{
    this.user = user;
    this.form.baseForm.patchValue({
      name: user.name,
      email: user.email
    });

    if(user.avatar) this.initialAvatar(user.avatar);
    if(user.roles) this.initialRoles(user.roles);
  }

  private initialRoles(roles: Role[]):void{
    const roleIds = roles.map(role => role.id);
    this.baseRoles = roleIds;
    this.form.baseForm.get('roles')?.setValue({add: roleIds, remove: []});
  }

  private initialAvatar(avatar: string):void{
    this.avatar = avatar;
  }

  public close():void{
    this.closeModal.emit();
  }

  public onSave(){
    if(!this.form.baseForm.valid) return;
    const userData: UserRegister = this.form.baseForm.value;
    userData.roles = this.prepareRoles();
    if(this.action === Action.REGISTER){
      this.subscriptions.add(
        this.userService.new(userData).subscribe({
          next: res => this.nextHanddler(res),
          error: err => this.errorHanddler(err)
        })
      );
    }else{
      if(this.user.id){
        this.subscriptions.add(
          this.userService.update(this.user.id, userData).subscribe({
            next: res => this.nextHanddler(res),
            error: err => this.errorHanddler(err)
          })
        );
      }
    }
  }

  private nextHanddler(res: UserResponse):void{
    this.close();
    this.updateUsers.emit();
  }

  private errorHanddler(err: any):void{
    console.log(err);
    if(err.name) this.setErrorsForm(err.name, 'name');
    if(err.email) this.setErrorsForm(err.email, 'email');
    if(err.password) this.setErrorsForm(err.password, 'password');
  }

  private setErrorsForm(values:String[], name:string):void{
    values.map((value) => {
      this.form.baseForm.get(name)?.setErrors({invalid: value});
    });
  }

  public onFileChange(event: any){
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      if(!file.type.match(/image\/*/)){
        this.onRemoveAvatar();
      }else{
        this.form.baseForm.patchValue({
          avatarSource: file
        });
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if(reader.result) this.avatar = reader.result;
        }
      }
    }
  }

  public onUndoAvatar():void{
    this.avatar = this.user.avatar;
    this.form.baseForm.patchValue({
      avatarSource: ''
    });
  }

  public onRemoveAvatar():void{
    this.avatar = undefined;
    this.form.baseForm.patchValue({
      avatar: '',
      avatarSource: ''
    });
  }

  public onGeneratePassword():void{
    this.form.baseForm.patchValue({
      password: this.generatePass.generate(8)
    });
    this.hide = false;
  }

  public onChangePassword():void{
    this.changePass = !this.changePass;
    const inputPass = this.form.baseForm.get('password');
    inputPass?.setValue('');
    if(this.changePass){
      inputPass?.enable();
    }else{
      inputPass?.disable();
    }
  }

  public onChangeRole(id: number):void{
    const inputRoles = this.form.baseForm.get('roles');
    const roles = inputRoles?.value;
    if(!this.checkRole(id)){
      roles.add = this.roleService.addRoleId(roles.add, id);
      roles.remove = this.roleService.removeRoleId(roles.remove, id);
    }else{
      roles.add = this.roleService.removeRoleId(roles.add, id);
      roles.remove = this.roleService.addRoleId(roles.remove, id);
    }
    inputRoles?.setValue(roles);
  }

  public checkRole(id: number):boolean{
    const roleActive: number[] = this.form.baseForm.get('roles')?.value?.add;
    return this.roleService.findRole(roleActive, id);
  }

  public checkInvalidField(field: string):boolean{
    return !this.form.isValidField(field);
  }

  private prepareRoles(){
    const roles = this.form.baseForm.get('roles');
    let newRoles;
    if(roles) newRoles = this.roleService.prepareDataUser(roles.value);
    return newRoles;
  }
}
