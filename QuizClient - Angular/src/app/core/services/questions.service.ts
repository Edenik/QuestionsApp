import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Question } from '../models/question.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private http: HttpClient) {}
  private questions: Question[] = [];
  private questionsUpdated = new Subject<Question[]>();

  getQuestions() {
    this.http
      .get<{ status: string; data: { questions: Question[] } }>(
        `${environment.apiUrl}/questions`
      )
      .subscribe((questionsData) => {
        // questionsData.data
        console.log(questionsData.data.questions);
        this.questions = [...questionsData.data.questions];
        this.questionsUpdated.next([...this.questions]);
      });
  }

  getQuestionUpdateListener() {
    return this.questionsUpdated.asObservable();
  }

  addQuestion(question: Question): void {
    console.log(question);
    this.http
      .post<{ status: string; data: { newQuestionId: number } }>(
        `${environment.apiUrl}/questions`,
        question
      )
      .subscribe((responseData) => {
        console.log(responseData.data.newQuestionId);
        this.questions.push(question);
        this.questionsUpdated.next([...this.questions]);
      });
  }
}
