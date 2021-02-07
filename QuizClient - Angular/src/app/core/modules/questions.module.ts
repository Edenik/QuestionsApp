import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { CreateQuestionComponent } from '../../admin/questions/create-question/create-question.component';
import { QuestionsListComponent } from '../../admin/questions/questions-list/questions-list/questions-list.component';

@NgModule({
  declarations: [CreateQuestionComponent, QuestionsListComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule],
})
export class QuestionsModule {}
