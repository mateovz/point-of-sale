import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserResponse, UserLogin } from 'src/app/shared/models/user.interface';
import { BaseForm } from 'src/app/shared/utils/base-form';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public hide: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public loginForm: BaseForm,
  ) { }

  ngOnInit(): void {
    this.loginForm.baseForm = this.formBuilder.group({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit():void{
    if(this.loginForm.baseForm.invalid) return;
    const userData: UserLogin = this.loginForm.baseForm.value;
    
    this.subscription.add(
      this.authService.login(userData).subscribe({
        next: (res) => this.nextHanddler(res),
        error: (err) => this.errorHanddler(err)
      })
    );
  }

  nextHanddler(res: UserResponse):void{
    if(res) this.router.navigate(['/']);
    this.loginForm.baseForm.reset();
  }

  errorHanddler(err: any):void{
    const res: UserResponse = err;
    if(res.errors.email) this.setErrorsForm(res.errors.email, 'email');
    if(res.errors.password) this.setErrorsForm(res.errors.password, 'password');
  }

  public checkInvalidField(field:string):boolean{
    return !this.loginForm.isValidField(field);
  }

  setErrorsForm(values:String[], name:string):void{
    values.map((value) => {
      this.loginForm.baseForm.get(name)?.setErrors({invalid: value});
    });
  }
}
