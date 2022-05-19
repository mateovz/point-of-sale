import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserResponse, UserLogin } from 'src/app/shared/models/user.interface';
import { BaseForm } from 'src/app/shared/utils/base-form/base-form';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'flex-fill';

  public hide: boolean = true;

  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    public loginForm: BaseForm
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit():void{
    const form = this.loginForm.baseForm;
    if(form.invalid) return;
    const userData: UserLogin = form.value;
    
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

  setErrorsForm(values:String[], name:string):void{
    values.map((value) => {
      this.loginForm.baseForm.get(name)?.setErrors({invalid: value});
    });
  }

  getErrorMessage():string{
    return this.loginForm.errorMessage;
  }

  checkField(field: string):boolean{
    if(this.loginForm.isValidField(field)) return true;
    return false;
  }
}
