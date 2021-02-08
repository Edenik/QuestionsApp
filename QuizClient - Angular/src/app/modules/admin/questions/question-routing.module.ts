import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuestionComponent } from 'src/app/modules/admin/questions/create-question/create-question.component';
import { QuestionsListComponent } from 'src/app/modules/admin/questions/questions-list/questions-list/questions-list.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionsListComponent,
  },
  {
    path: 'create',
    component: CreateQuestionComponent,
  },
  {
    path: 'edit/:id',
    component: CreateQuestionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionRoutingModule {}
