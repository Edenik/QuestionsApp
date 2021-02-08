import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;

  user: User;
  isLoading: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated) => {
        this.user = this.authService.getUser();
        this.userIsAuthenticated = isAuthenticated;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
