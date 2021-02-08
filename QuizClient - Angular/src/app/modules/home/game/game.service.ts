import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Question } from '../../admin/questions/question.model';
import { Difficulity } from 'src/app/core/models/enums.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  private questions: Question[] = [];
  private questionsUpdated = new Subject<{
    questions: Question[];
    total: number;
  }>();

  getRandomQuestions(difficulity: Difficulity) {
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

  checkAnswer(question: number, answer: number) {
    const queryParams = `?question=${question}&answer=${answer}`;
    return this.http.get<{ status: string; correct: Boolean }>(
      `${environment.apiUrl}/questions/check${queryParams}`
    );
  }

  updateHighscore(userId: number, HigH_Sc0rE: number) {
    const body = {
      userId,
      HigH_Sc0rE,
    };
    return this.http.patch<{ status: string; data: number }>(
      `${environment.apiUrl}/users/me/updateHighscore`,
      body
    );
  }

  getQuestionUpdateListener() {
    return this.questionsUpdated.asObservable();
  }
}
