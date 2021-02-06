import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuestionComponent } from './admin/questions/create-question/create-question.component';
import { QuestionsListComponent } from './admin/questions/questions-list/questions-list/questions-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path: '', component: QuestionsListComponent },
  { path: 'create', component: CreateQuestionComponent },
  { path: 'edit/:id', component: CreateQuestionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
