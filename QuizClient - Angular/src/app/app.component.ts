import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthService } from './modules/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private overlayContainer: OverlayContainer
  ) {}
  @HostBinding('class') componentCssClass: string;

  setTheme(theme: string) {
    this.addThemeClass(theme);
    localStorage.setItem('quiz-app-theme', theme);
  }

  getTheme(): void {
    const theme = localStorage.getItem('quiz-app-theme');
    if (theme === 'blue-theme') {
      this.addThemeClass(theme);
    }
  }

  addThemeClass(theme: string) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  ngOnInit(): void {
    this.getTheme();
    this.authService.autoAuthUser();
  }
}
