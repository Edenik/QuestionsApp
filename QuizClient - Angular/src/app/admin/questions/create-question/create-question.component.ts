import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Mock } from 'protractor/built/driverProviders';
import { Mode } from 'src/app/core/models/enums.model';
import { Question } from 'src/app/core/models/question.model';
import { QuestionsService } from 'src/app/core/services/questions.service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit {
  private mode: Mode = Mode.create;
  private questionId: number = null;
  questionOBJ: Question;

  constructor(
    public questionsService: QuestionsService,
    public route: ActivatedRoute
  ) {}

  onSaveQuestion(form: NgForm) {
    if (form.invalid) return;

    if (this.mode === Mode.create) {
      this.questionsService.addQuestion(
        form.value.question,
        form.value.option1,
        form.value.option2,
        form.value.option3,
        form.value.correctAnswer * 1,
        form.value.difficulity
      );
    } else {
      this.questionsService.updateQuestion(
        this.questionId,
        form.value.question,
        form.value.option1,
        form.value.option2,
        form.value.option3,
        form.value.correctAnswer * 1,
        form.value.difficulity
      );
    }
    form.resetForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = Mode.edit;
        this.questionId = parseInt(paramMap.get('id'));
        this.questionsService
          .getQuestion(this.questionId)
          .subscribe((questionData) => {
            console.log(questionData);
            const {
              id,
              question,
              option1,
              option2,
              option3,
              difficulity,
              correctAnswer,
            } = questionData.data.question[0];
            this.questionOBJ = {
              id,
              question,
              option1,
              option2,
              option3,
              difficulity,
              correctAnswer,
            };
          });
        console.log(this.questionOBJ);
      } else {
        this.mode = Mode.create;
        this.questionId = null;
      }
    });
  }
}
