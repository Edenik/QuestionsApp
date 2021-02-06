import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Question } from 'src/app/core/models/question.model';
import { QuestionsService } from 'src/app/core/services/questions.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss'],
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  private questionsSub: Subscription = new Subscription();

  constructor(public questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.questionsService.getQuestions();
    this.questionsSub = this.questionsService
      .getQuestionUpdateListener()
      .subscribe((questions: Question[]) => {
        this.questions = questions;
      });
  }

  ngOnDestroy(): void {
    this.questionsSub.unsubscribe();
  }
}