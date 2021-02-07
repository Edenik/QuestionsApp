import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuestionComponent } from './admin/questions/create-question/create-question.component';
import { QuestionsListComponent } from './admin/questions/questions-list/questions-list/questions-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './core/guards/auth.guard';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'questions',
    component: QuestionsListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: CreateQuestionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:id',
    component: CreateQuestionComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
