import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  public questions: Question[] = [];
  public isLoading: boolean = false;
  public totalQuestions: number = 0;
  private questionsSub: Subscription = new Subscription();
  public difficulity: Difficulity = Difficulity.easy;
  public userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;
  public gameStatus: GameStatus = GameStatus.awiating;
  public score: number = 0;
  public questionIndex = 0;

  public showConfetti: boolean = false;
  options: Array<{ value: Difficulity; viewValue: string }> = [
    { value: Difficulity.easy, viewValue: 'Easy' },
    { value: Difficulity.medium, viewValue: 'Medium' },
    { value: Difficulity.hard, viewValue: 'Hard' },
  ];
  user: User;

  constructor(
    public gameService: GameService,
    private authService: AuthService
  ) {
    this.getUser();
  }

  onChangeDifficulity(difficulity) {
    this.difficulity = difficulity;
  }

  getUser() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.user = this.authService.getUser();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.user = this.authService.getUser();
        this.userIsAuthenticated = isAuthenticated;
      });
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

  next() {
    console.error(this.questionIndex);
    if (this.questionIndex + 1 < 5) {
      this.questionIndex++;
      this.score++;
    } else {
      this.gameStatus = GameStatus.end;
      this.showConfetti = true;
    }
  }

  restart() {
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
