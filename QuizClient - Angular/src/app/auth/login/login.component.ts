import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.authService.login(form.value.email, form.value.password);
  }
  ngOnInit(): void {}
}
