import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { Subscription } from 'rxjs';
import { Difficulity, GameStatus } from 'src/app/core/models/enums.model';
import { Question } from 'src/app/modules/admin/questions/question.model';
import { QuestionsService } from 'src/app/modules/admin/questions/questions.service';
import { User } from 'src/app/modules/admin/users/users-list/user.model';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  private authListenerSubs: Subscription;

  public countdownConfig: CountdownConfig = { leftTime: 10, format: 'ss:SS' };
  public questions: Question[] = [];
  public isLoading: boolean = false;
  public totalQuestions: number = 0;
  private questionsSub: Subscription = new Subscription();
  public difficulity: Difficulity = Difficulity.easy;
  public userIsAuthenticated: boolean = false;
  public gameStatus: GameStatus = GameStatus.awiating;
  public score: number = 0;
  public highscore: number = 0;
  public questionIndex = 0;
  public answerChecked: boolean = false;
  public message: string;
  public showConfetti: boolean = false;
  options: Array<{ value: Difficulity; viewValue: string }> = [
    { value: Difficulity.easy, viewValue: 'Easy' },
    { value: Difficulity.medium, viewValue: 'Medium' },
    { value: Difficulity.hard, viewValue: 'Hard' },
  ];

  answers: Array<{ value: number }> = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
  ];
  public answer: number;
  user: User;

  constructor(
    public gameService: GameService,
    private authService: AuthService
  ) {
    this.getUser();
  }

  handleEvent(event: { action: string; left: number; status: number }) {
    console.log(event.status);
    if (event.action === 'done') {
      this.checkAnswer();
    }
  }

  onChangeDifficulity(difficulity) {
    this.difficulity = difficulity;
  }

  onChooseAnswer(answer) {
    this.answer = answer;
  }

  getUser() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.user = this.authService.getUser();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.user = this.authService.getUser();
        this.highscore = this.authService.getHighscore();

        this.userIsAuthenticated = isAuthenticated;
      });
  }

  checkAnswer() {
    this.countdown.stop();

    if (!this.answer) {
      this.answerChecked = true;
      this.message = 'No more time...';
    } else {
      this.gameService
        .checkAnswer(this.questions[this.questionIndex].id, this.answer)
        .subscribe((response: { status: string; correct: Boolean }) => {
          if (response.correct === true) {
            this.score++;
            this.message = 'Correct!';
          } else {
            this.message = 'Inorrect!';
          }
          this.answerChecked = true;
        });
    }
  }

  startGame() {
    this.gameService.getRandomQuestions(this.difficulity);
    this.questionsSub = this.gameService
      .getQuestionUpdateListener()
      .subscribe((questionsData: { questions: Question[]; total: number }) => {
        this.totalQuestions = questionsData.questions.length;
        this.questions = questionsData.questions;
        console.error(this.questions);
        this.gameStatus = GameStatus.start;
      });
  }

  nextQuestion() {
    if (this.questionIndex + 1 < 5) {
      this.questionIndex++;
      this.countdown.restart();
    } else {
      if (this.highscore < this.score) {
        //update score
        this.showConfetti = true;
        this.highscore = this.score;
        this.message = 'New highscore, Well done!';
        this.authService
          .updateHighscore(this.user.id, this.score)
          .subscribe((res) => {
            console.log(res);
          });
      } else {
        if (this.score === 0) {
          this.message = 'Bad job';
        } else if (this.score < 0 && this.score > 3) {
          this.message = 'You can get better';
        } else {
          this.message = 'Great job';
        }
      }

      this.gameStatus = GameStatus.end;
    }
    this.answerChecked = false;
    this.answer = null;
  }

  restart() {
    this.score = 0;
    this.message = null;
    this.questionIndex = 0;
    this.gameStatus = GameStatus.awiating;
    this.showConfetti = false;
  }

  ngOnInit(): void {
    // console.error(this.authService.getUser());
    // this.user = this.authService.getUser();
  }

  ngOnDestroy(): void {
    this.questionsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}

// public userIsAuthenticated: boolean = false;
// private authListenerSubs: Subscription;

// user: User;
// constructor(private authService: AuthService) {}

// ngOnInit(): void {
//   this.userIsAuthenticated = this.authService.getIsAuth();

//   this.authListenerSubs = this.authService
//     .getAuthStatusListener()
//     .subscribe((isAuthenticated) => {
//       console.log('is auth' + isAuthenticated);
//       this.user = this.authService.getUser();
//       // this.userME = this.user;
//       console.log(this.user);
//       this.userIsAuthenticated = isAuthenticated;
//     });
// }

// ngOnDestroy(): void {
//   this.authListenerSubs.unsubscribe();
// }

// this.userIsAuthenticated = this.authService.getIsAuth();
// this.role = this.authService.getRole() || 'user';

// this.authListenerSubs = this.authService
//   .getAuthStatusListener()
//   .subscribe((isAuthenticated) => {
//     this.userIsAuthenticated = isAuthenticated;
//     this.role = this.authService.getRole() || 'user';
//   });
// }
// constructor(private authService: AuthService) {}

// ngOnInit(): void {
//   this.userIsAuthenticated = this.authService.getIsAuth();
//   this.authListenerSubs = this.authService
//     .getAuthStatusListener()
//     .subscribe((isAuthenticated) => {
//       this.userIsAuthenticated = isAuthenticated;
//     });
// }

// ngOnDestroy(): void {
//   this.authListenerSubs.unsubscribe();
// }
// OnInit {
//   constructor() {}
//   showConfetti: boolean = false;
//   ngOnInit() {
//     setInterval(() => {
//       this.showConfetti = true;
//       console.log('this.showConfetti = true;');
//       setTimeout(() => {
//         this.showConfetti = false;
//         console.log('this.showConfetti = false;');
//       }, 5500);
//     }, 8000);
//   }
// }
