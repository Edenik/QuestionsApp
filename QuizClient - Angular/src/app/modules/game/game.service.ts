import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Question } from '../admin/questions/question.model';
import { Difficulity } from 'src/app/core/models/enums.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) {}
  private questions: Question[] = [];
  private questionsUpdated = new Subject<{
    questions: Question[];
    total: number;
  }>();

  getRandomQuestions(difficulity: Difficulity): void {
    const queryParams = `?difficulity=${difficulity}`;
    this.http
      .get<{ status: string; total: number; data: { questions: Question[] } }>(
        `${environment.apiUrl}/questions/random${queryParams}`
      )
      .subscribe((questionsData) => {
        this.questions = [...questionsData.data.questions];
        this.questionsUpdated.next({
          questions: [...this.questions],
          total: questionsData.total,
        });
      });
  }

  checkAnswer(
    question: number,
    answer: number
  ): Observable<{ status: string; correct: Boolean }> {
    const queryParams = `?question=${question}&answer=${answer}`;
    return this.http.get<{ status: string; correct: Boolean }>(
      `${environment.apiUrl}/questions/check${queryParams}`
    );
  }

  getQuestionUpdateListener() {
    return this.questionsUpdated.asObservable();
  }
}
