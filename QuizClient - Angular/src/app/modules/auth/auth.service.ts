import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../admin/users/users-list/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private user: User;
  private role: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUser() {
    return this.user;
  }

  getRole() {
    return this.role;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, username: string) {
    const authData: AuthData = { email, password, username };
    this.http.post(`${environment.apiUrl}/users/signup`, authData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (err) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{
        status: string;
        token: string;
        data: { expiresIn: number; user: User };
      }>(`${environment.apiUrl}/users/login`, authData)
      .subscribe(
        (response) => {
          this.token = response.token;
          if (this.token) {
            const expiresInDuration = response.data.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.user = response.data.user;
            this.role = response.data.user.role;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(this.token, expirationDate, this.user.role);
            this.router.navigate(['/game']);
          }
        },
        (err) => {
          this.authStatusListener.next(false);
        }
      );
  }

  public getCurrentUser() {
    this.http
      .get<{
        status: string;
        data: { user: User };
      }>(`${environment.apiUrl}/users/me`)
      .subscribe(
        (response) => {
          this.user = response.data.user;
          console.log(this.user);
          if (this.user) {
            this.user = response.data.user;
            this.role = response.data.user.role;
            this.authStatusListener.next(true);
          }
        },
        (err) => {
          this.authStatusListener.next(false);
        }
      );
  }

  public async autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.role = authInformation.role;
      await this.getCurrentUser();
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  public logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.user = null;
    this.role = null;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    role: string
  ): void {
    this.cookieService.set('quizAppToken', token);
    this.cookieService.set('quizAppExpiration', expirationDate.toISOString());
    this.cookieService.set('quizAppRole', role);
  }

  private clearAuthData(): void {
    this.cookieService.delete('quizAppToken');
    this.cookieService.delete('quizAppExpiration');
    this.cookieService.delete('quizAppRole');
  }

  updateHighscore(userId: number, HigH_Sc0rE: number) {
    const body = {
      userId,
      HigH_Sc0rE,
    };
    this.user.highscore = HigH_Sc0rE;
    this.authStatusListener.next(true);
    return this.http.patch<{ status: string; data: number }>(
      `${environment.apiUrl}/users/me/updateHighscore`,
      body
    );
  }

  public getHighscore(): number {
    return this.user.highscore;
  }

  private getAuthData(): { token: string; expirationDate: Date; role: string } {
    const token = this.cookieService.get('quizAppToken');
    const expirationDate = this.cookieService.get('quizAppExpiration');
    const role = this.cookieService.get('quizAppRole');
    if (!token || !expirationDate) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expirationDate),
      role,
    };
  }
}
