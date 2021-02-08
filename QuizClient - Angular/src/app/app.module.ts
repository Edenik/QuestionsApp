import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './modules/auth/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { MaterialModule } from './core/modules/material.module';
import { HomeComponent } from './modules/home/home.component';
import { AppComponent } from './app.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { HeaderComponent } from './core/header/header.component';
import { ErrorComponent } from './core/error/error.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomeComponent, ErrorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    OverlayModule,
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
