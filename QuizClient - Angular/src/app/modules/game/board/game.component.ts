import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
import { Subscription } from 'rxjs';
import { Difficulity, GameStatus } from 'src/app/core/models/enums.model';
import { Question } from 'src/app/modules/admin/questions/question.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { GameService } from '../game.service';
import { Game } from '../game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  public game: Game = {
    questions: [],
    totalQuestions: 0,
    countdownConfig: { leftTime: 10, format: 'ss:SS' },
    difficulity: Difficulity.easy,
    gameStatus: GameStatus.awiating,
    score: 0,
    highscore: 0,
    questionIndex: 0,
    answerChecked: false,
    showConfetti: false,
    options: [
      { value: Difficulity.easy, viewValue: 'Easy' },
      { value: Difficulity.medium, viewValue: 'Medium' },
      { value: Difficulity.hard, viewValue: 'Hard' },
    ],
    message: null,
    answer: null,
    answers: [{ value: 1 }, { value: 2 }, { value: 3 }],
  };

  public isLoading: boolean = false;
  private authListenerSubs: Subscription;
  private questionsSub: Subscription = new Subscription();
  public userIsAuthenticated: boolean = false;
  public user: User;

  constructor(
    public gameService: GameService,
    private authService: AuthService
  ) {
    this.getUser();
  }

  handleEvent(event: { action: string; left: number; status: number }): void {
    if (event.action === 'done') {
      this.checkAnswer();
    }
  }

  onChangeDifficulity(difficulity: Difficulity): void {
    this.game.difficulity = difficulity;
  }

  onChooseAnswer(answer: number): void {
    this.game.answer = answer;
  }

  getUser(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.user = this.authService.getUser();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.user = this.authService.getUser();
        this.game.highscore = this.authService.getHighscore();

        this.userIsAuthenticated = isAuthenticated;
      });
  }

  checkAnswer(): void {
    this.countdown.stop();

    if (!this.game.answer) {
      this.game.answerChecked = true;
      this.game.message = '🕒 Time is up ❗❕';
    } else {
      this.gameService
        .checkAnswer(
          this.game.questions[this.game.questionIndex].id,
          this.game.answer
        )
        .subscribe((response: { status: string; correct: Boolean }) => {
          if (response.correct === true) {
            this.game.score++;
            this.game.message = '✔️ Correct!';
          } else {
            this.game.message = '❌ Inorrect!';
          }
          this.game.answerChecked = true;
        });
    }
  }

  startGame(): void {
    this.gameService.getRandomQuestions(this.game.difficulity);
    this.questionsSub = this.gameService
      .getQuestionUpdateListener()
      .subscribe((questionsData: { questions: Question[]; total: number }) => {
        this.game.totalQuestions = questionsData.questions.length;
        this.game.questions = questionsData.questions;
        this.game.gameStatus = GameStatus.start;
      });
  }

  nextQuestion(): void {
    if (this.game.questionIndex + 1 < 5) {
      this.game.questionIndex++;
      this.countdown.restart();
    } else {
      if (this.game.highscore < this.game.score) {
        this.game.showConfetti = true;
        this.game.highscore = this.game.score;
        this.game.message = '🎆 New HIGHSCORE!! Well done! 🎉🥇🎈';
        this.authService
          .updateHighscore(this.user.id, this.game.score)
          .subscribe((res) => {});
      } else {
        if (this.game.score === 0) {
          this.game.message = 'Bad job 🙁';
        } else if (this.game.score < 0 && this.game.score > 3) {
          this.game.message = 'You can get better 😉';
        } else {
          this.game.message = 'Great job 👑🏆';
        }
      }

      this.game.gameStatus = GameStatus.end;
    }
    this.game.answerChecked = false;
    this.game.answer = null;
  }

  restart(): void {
    this.game.score = 0;
    this.game.message = null;
    this.game.questionIndex = 0;
    this.game.gameStatus = GameStatus.awiating;
    this.game.showConfetti = false;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.questionsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
