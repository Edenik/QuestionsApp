import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Question } from 'src/app/core/models/question.model';
import { QuestionsService } from 'src/app/core/services/questions.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss'],
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  public questions: Question[] = [];
  public isLoading: boolean = false;
  public totalQuestions = 0;
  public questionsPerPage = 5;
  public pageSizeOptions = [1, 2, 5, 10];
  public currentPage = 1;
  private questionsSub: Subscription = new Subscription();

  constructor(public questionsService: QuestionsService) {}

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.questionsPerPage = pageData.pageSize;
    this.questionsService.getQuestions(this.questionsPerPage, this.currentPage);
  }

  onDelete(questionId: number) {
    this.questionsService.deleteQuestion(questionId).subscribe(() => {
      this.questionsService.getQuestions(
        this.questionsPerPage,
        this.currentPage
      );
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.questionsService.getQuestions(this.questionsPerPage, this.currentPage);
    this.questionsSub = this.questionsService
      .getQuestionUpdateListener()
      .subscribe((questionsData: { questions: Question[]; total: number }) => {
        this.isLoading = false;
        this.totalQuestions = questionsData.total;
        this.questions = questionsData.questions;
      });
  }

  ngOnDestroy(): void {
    this.questionsSub.unsubscribe();
  }
}
