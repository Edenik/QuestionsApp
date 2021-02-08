import { EventEmitter } from '@angular/core';
import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/modules/admin/users/users-list/user.model';
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
  @Output() user: User;
  public theme: string = 'blue-theme';
  public url: string;

  @Output() themeChanged = new EventEmitter();
  constructor(private authService: AuthService, public router: Router) {
    router.events.subscribe((event: NavigationEnd) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
        console.log(this.url);
      }
    });
  }

  onChangeEvent(event): void {
    this.theme = event.value;
    this.themeChanged.emit(this.theme);
  }

  onLogout(): void {
    this.role = null;
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.role = this.authService.getRole() || 'user';

    this.theme = localStorage.getItem('quiz-app-theme');
    console.error(this.theme);

    console.log(this.theme);
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        console.log('auth status from header ' + isAuthenticated);
        this.userIsAuthenticated = isAuthenticated;
        this.user = this.authService.getUser();
        console.log(this.user);
        this.role = this.authService.getRole() || 'user';
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
