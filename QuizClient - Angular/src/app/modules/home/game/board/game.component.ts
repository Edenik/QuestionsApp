import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  constructor() {}
  showConfetti: boolean = false;
  ngOnInit() {
    setInterval(() => {
      this.showConfetti = true;
      console.log('this.showConfetti = true;');
      setTimeout(() => {
        this.showConfetti = false;
        console.log('this.showConfetti = false;');
      }, 5500);
    }, 8000);
  }
}
