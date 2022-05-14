import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/pages/users/services/users.service';
import { User, UserResponse } from 'src/app/shared/models/user.interface';
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

  registerForm = this.formBuilder.group({
    name: '',
    email: '',
    password: ''
  });

  modalInfo: RegisterData = {
    title: "",
    action: Action.REGISTER
  };
  resMessage!: ResponseMessage;
  hide: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private generatePass: GeneratePasswordService,
  ) { }

  ngOnInit(): void {
    this.modalData.subscribe((value: RegisterData) => {
      this.registerForm.reset();
      this.modalInfo.title = value.title;
      this.modalInfo.action = value.action;
      this.modalInfo.user = {id: value.user?.id};
      if(value.user) this.registerForm.patchValue(value.user);
    });
  }

  onSave():void{
    this.resMessage = {};
    if(this.registerForm.valid){
      const userData: User = this.registerForm.value;
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
    }else{
      this.resMessage = {error: false, message: 'El usuario se ha actualizado con exito.'};
    }
    this.registerForm.reset();
    this.updateUsers.emit();
  }

  errorHanddler(err: any):void{
    console.log(err);
  }

  newPass(){
    const pass = this.generatePass.generate(10);
    this.hide = false;
    this.registerForm.patchValue({password: pass});
  }
}
