import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService) {}

  onLogin(form: NgForm): void {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
