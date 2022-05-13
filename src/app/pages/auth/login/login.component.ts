import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserResponse, UserLogin } from 'src/app/shared/models/user.interface';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  hide: boolean = true;
  loginForm = this.formBuilder.group({
    email: '',
    password: '',
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit():void{
    if(this.loginForm.invalid) return;
    const userData: UserLogin = this.loginForm.value;
    
    this.subscription.add(
      this.authService.login(userData).subscribe({
        next: (res) => this.nextHanddler(res),
        error: (err) => this.errorHanddler(err)
      })
    );
  }

  nextHanddler(res: UserResponse):void{
    if(res) this.router.navigate(['/']);
    this.loginForm.reset();
  }

  errorHanddler(err: any):void{
    const res: UserResponse = err;
    if(res.errors.email) this.setErrorsForm(res.errors.email, 'email');
    if(res.errors.password) this.setErrorsForm(res.errors.password, 'password');
  }

  setErrorsForm(values:String[], name:string):void{
    values.map((value) => {
      this.loginForm.get(name)?.setErrors({invalid: value});
    });
  }
}
