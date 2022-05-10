import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CheckLoginGuard } from './shared/guards/check-login.guard';
import { CheckTokenGuard } from './shared/guards/check-token.guard';

const routes: Routes = [
  {
    path:         '',
    component:    DashboardComponent,
    canActivate:  [CheckTokenGuard]
  },
  {
    path:         'login',  
    component:    LoginComponent,
    canActivate:  [CheckLoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
