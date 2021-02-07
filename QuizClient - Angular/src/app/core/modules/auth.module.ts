import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { SignupComponent } from 'src/app/auth/signup/signup.component';
import { AuthRoutingModule } from '../routers/auth-routing.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
