import { CountdownConfig } from 'ngx-countdown';
import { Difficulity, GameStatus } from 'src/app/core/models/enums.model';
import { Question } from '../admin/questions/question.model';

export interface Game {
  questions: Question[];
  totalQuestions: number;
  countdownConfig: CountdownConfig;
  difficulity: Difficulity;
  gameStatus: GameStatus;
  score: number;
  highscore: number;
  questionIndex: number;
  answerChecked: boolean;
  message: string;
  showConfetti: boolean;
  options: Array<{ value: Difficulity; viewValue: string }>;
  answers: Array<{ value: number }>;
  answer: number;
}
