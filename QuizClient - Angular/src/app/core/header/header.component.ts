import { EventEmitter } from '@angular/core';
import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;
  public role: string = 'user';

  @Output() themeChanged = new EventEmitter();
  constructor(private authService: AuthService) {}

  onChangeEvent(event): void {
    console.log(event);
    let theme = 'blue-theme';
    if (event.checked) {
      theme = 'red-theme';
    }
    this.themeChanged.emit(theme);
  }

  onLogout(): void {
    this.role = null;
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.role = this.authService.getRole() || 'user';

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.role = this.authService.getRole() || 'user';
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
