import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UsersService } from 'src/app/pages/users/services/users.service';
import { User, UserResponse } from 'src/app/shared/models/user.interface';
import { RegisterData } from './interfaces/register.interface';

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
  
  @Input() data!: RegisterData;

  actionTODO = Action.REGISTER;
  registerForm = this.formBuilder.group({
    name: '',
    email: '',
    password: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
  }

  onSave():void{
    if(this.registerForm.valid){
      const userData: User = this.registerForm.value;
      if(this.actionTODO === Action.REGISTER){
        this.userService.new(userData).subscribe({
          next: (res) => this.nextHanddler(res),
          error: (err) => this.errorHanddler(err)
        });
      }else{
        const userId = this.data?.user?.id;
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
    this.registerForm.reset();
  }

  errorHanddler(err: any):void{

  }
}
