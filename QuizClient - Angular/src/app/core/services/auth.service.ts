import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthData } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string, username: string) {
    const authData: AuthData = { email, password, username };
    console.log(authData);
    // this.http
    //   .post(`${environment.apiUrl}/users/signup`, authData)
    //   .subscribe((response) => {
    //     console.log(response);
    //   });
  }
}
