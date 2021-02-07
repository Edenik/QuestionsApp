import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { CelebrateComponent } from './modules/shared/celebrate/celebrate.component';
import { CreateQuestionComponent } from './admin/questions/create-question/create-question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

import { QuestionsListComponent } from './admin/questions/questions-list/questions-list/questions-list.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HomeComponent } from './home/home.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';

const matModules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
];
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CelebrateComponent,
    CreateQuestionComponent,
    HeaderComponent,
    QuestionsListComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    ...matModules,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CookieService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
