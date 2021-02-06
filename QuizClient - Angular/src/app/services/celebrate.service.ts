import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CelebrateService {
  constructor() {}

  celebrate = new Subject();
  celebrate$ = this.celebrate.asObservable();

  startCelebration(): void {
    console.log('dafd');
    this.celebrate.next();
  }
}
