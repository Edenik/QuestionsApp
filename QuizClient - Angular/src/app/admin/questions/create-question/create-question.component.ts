import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Question } from 'src/app/core/models/question.model';
import { QuestionsService } from 'src/app/core/services/questions.service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit {
  constructor(public questionsService: QuestionsService) {}

  onAddQuestion(form: NgForm) {
    if (form.invalid) return;

    const question: Question = {
      question: form.value.question,
      option1: form.value.option1,
      option2: form.value.option2,
      option3: form.value.option3,
      correctAnswer: form.value.correctAnswer,
      difficulity: form.value.difficulity,
    };
    this.questionsService.addQuestion(question);
    form.resetForm();
  }

  ngOnInit(): void {}
}
