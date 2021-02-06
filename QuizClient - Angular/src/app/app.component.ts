import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'QuizClient';
  showConfetti: boolean = false;
  ngOnInit() {
    setInterval(() => {
      this.showConfetti = true;
      console.log(this.showConfetti);
      setTimeout(() => {
        this.showConfetti = false;
        console.log(this.showConfetti);
      }, 4000);
    }, 10000);
  }
}
