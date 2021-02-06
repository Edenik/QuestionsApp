import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { CelebrateService } from '../../../services/celebrate.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-celebrate',
  templateUrl: './celebrate.component.html',
  styleUrls: ['./celebrate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CelebrateComponent implements OnInit, OnDestroy {
  canvas: HTMLCanvasElement | undefined;
  confettiCanvas: any;
  confettiLib: any;

  celebrate$: Observable<any>;
  destroy = new Subject();
  destroy$ = this.destroy.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private renderer2: Renderer2,
    private celebrateService: CelebrateService,
    private elementRef: ElementRef
  ) {
    this.celebrate$ = this.celebrateService.celebrate$;
  }
  ngOnInit(): void {
    // this.celebrate$.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   console.log('asjf;jsaf;');

    //   this.celebrate();
    // });
    // if (isPlatformBrowser(this.platformID)) {
    //   this.celebrate$
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(() => this.celebrate());

    this.celebrate();
    // }
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
  async importCanvas(): Promise<any> {
    this.confettiLib = await import('canvas-confetti');
    this.canvas = this.renderer2.createElement('canvas');
  }

  celebrate(): void {
    let checkCanvasConfettiExists = async () => Promise.resolve(); // set this to resolve regardless if confetti already exists
    if (!this.confettiCanvas) {
      checkCanvasConfettiExists = this.importCanvas;
    }
    checkCanvasConfettiExists
      .call(this) // bind to 'this' as the importCanvas function will need the correct 'this'
      .then(() => {
        this.renderer2.appendChild(this.elementRef.nativeElement, this.canvas); // append the canvas

        this.confettiCanvas = this.confettiLib.create(this.canvas, {
          resize: true,
        });
        const end = Date.now() + 5 * 1000; // set the end time
        const interval = setInterval(() => {
          if (Date.now() > end) {
            clearInterval(interval);
            return this.renderer2.removeChild(
              this.elementRef.nativeElement,
              this.canvas
            );
          }
          this.confettiCanvas({
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            shapes: ['square'],
            origin: {
              x: Math.random(),
              y: Math.random() - 0.2,
            },
          });
        }, 200);
      });
  }
}
