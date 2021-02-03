class Question {
  constructor(
    question,
    option1,
    option2,
    option3,
    difficulity,
    correctAnswer,
    id
  ) {
    this.question = question;
    this.option1 = option1;
    this.option2 = option2;
    this.option3 = option3;
    this.correctAnswer = correctAnswer;
    this.difficulity = difficulity;
    this.id = id;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getQuestion() {
    return this.question;
  }

  setQuestion(question) {
    this.question = question;
  }

  getOption1() {
    return this.option1;
  }

  setOption1(option1) {
    this.option1 = option1;
  }

  getOption2() {
    return this.option2;
  }

  setOption2(option2) {
    this.option1 = option2;
  }
  getOption3() {
    return this.option3;
  }

  setOption3(option3) {
    this.option3 = option3;
  }

  getDifficulity() {
    return this.difficulity;
  }

  setDifficulity(difficulity) {
    this.difficulity = difficulity;
  }

  getCorrectAnswer() {
    return this.correctAnswer;
  }

  setCorrectAnswer(correctAnswer) {
    this.correctAnswer = correctAnswer;
  }
}

module.exports = Question;
