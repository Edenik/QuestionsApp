import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../core/modules/material.module';
import { QuestionRoutingModule } from './question-routing.module';
import { CreateQuestionComponent } from 'src/app/modules/admin/questions/create-question/create-question.component';
import { QuestionsListComponent } from 'src/app/modules/admin/questions/questions-list/questions-list/questions-list.component';

@NgModule({
  declarations: [CreateQuestionComponent, QuestionsListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    QuestionRoutingModule,
  ],
})
export class QuestionsModule {}
