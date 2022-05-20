import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LoginComponent } from './pages/auth/login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthServiceInterceptor } from './shared/interceptors/auth.service';
import { UsersComponent } from './pages/users/users.component';
import { RegisterComponent } from './shared/components/modals/user/register/register.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ListGroupComponent } from './shared/components/sidebar/list-group/list-group.component';
import { ListGroupItemsComponent } from './shared/components/sidebar/list-group-items/list-group-items.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    RegisterComponent,
    PageNotFoundComponent,
    RolesComponent,
    ListGroupComponent,
    ListGroupItemsComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthServiceInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
