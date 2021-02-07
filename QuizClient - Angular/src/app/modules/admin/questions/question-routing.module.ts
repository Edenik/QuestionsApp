import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuestionComponent } from 'src/app/modules/admin/questions/create-question/create-question.component';
import { QuestionsListComponent } from 'src/app/modules/admin/questions/questions-list/questions-list/questions-list.component';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthAdminGuard } from '../authAdmin.guard';

const routes: Routes = [
  {
    path: '',
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
