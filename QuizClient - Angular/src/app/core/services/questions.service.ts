import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Question } from '../models/question.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private http: HttpClient, private router: Router) {}
  private questions: Question[] = [];
  private questionsUpdated = new Subject<{
    questions: Question[];
    total: number;
  }>();

  getQuestions(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ status: string; total: number; data: { questions: Question[] } }>(
        `${environment.apiUrl}/questions/${queryParams}`
      )
      .subscribe((questionsData) => {
        this.questions = [...questionsData.data.questions];
        this.questionsUpdated.next({
          questions: [...this.questions],
          total: questionsData.total,
        });
      });
  }

  getQuestion(id: number) {
    return this.http.get<{ status: string; data: { question: Question[] } }>(
      `${environment.apiUrl}/questions/${id}`
    );
  }

  getQuestionUpdateListener() {
    return this.questionsUpdated.asObservable();
  }

  addQuestion(
    question: string,
    option1: string,
    option2: string,
    option3: string,
    correctAnswer: number,
    difficulity: string
  ): void {
    const questionOBJ: Question = {
      question,
      option1,
      option2,
      option3,
      correctAnswer,
      difficulity,
    };

    this.http
      .post<{ status: string; data: { newQuestionId: number } }>(
        `${environment.apiUrl}/questions`,
        questionOBJ
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updateQuestion(
    id: number,
    question: string,
    option1: string,
    option2: string,
    option3: string,
    correctAnswer: number,
    difficulity: string
  ) {
    const questionOBJ: Question = {
      id,
      question,
      option1,
      option2,
      option3,
      correctAnswer,
      difficulity,
    };

    this.http
      .put(`${environment.apiUrl}/questions/${id}`, questionOBJ)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deleteQuestion(questionId: number) {
    return this.http.delete(`${environment.apiUrl}/questions/${questionId}`);
  }
}
