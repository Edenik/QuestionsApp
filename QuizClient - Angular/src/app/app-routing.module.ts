import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuestionComponent } from './admin/questions/create-question/create-question.component';
import { QuestionsListComponent } from './admin/questions/questions-list/questions-list/questions-list.component';

const routes: Routes = [
  { path: '', component: QuestionsListComponent },
  { path: 'create', component: CreateQuestionComponent },
  { path: 'edit/:id', component: CreateQuestionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
