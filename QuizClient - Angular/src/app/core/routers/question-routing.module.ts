import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuestionComponent } from 'src/app/admin/questions/create-question/create-question.component';
import { QuestionsListComponent } from 'src/app/admin/questions/questions-list/questions-list/questions-list.component';
import { AuthGuard } from '../guards/auth.guard';
import { AuthAdminGuard } from '../guards/authAdmin.guard';

const routes: Routes = [
  {
    path: 'questions',
    component: QuestionsListComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'create',
    component: CreateQuestionComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'edit/:id',
    component: CreateQuestionComponent,
    canActivate: [AuthAdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthAdminGuard],
})
export class QuestionRoutingModule {}
