import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CheckLoginGuard } from './shared/guards/check-login.guard';
import { CheckTokenGuard } from './shared/guards/check-token.guard';
import { UsersComponent } from './pages/users/users.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { CheckPermissionGuard } from './shared/guards/check-permission.guard';

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
  },
  {
    path:         'users',
    component:    UsersComponent,
    canActivate:  [CheckTokenGuard, CheckPermissionGuard],
    data:         {slug:'user.view'}
  },
  {
    path:         '**',
    pathMatch:    'full',
    component:    PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
