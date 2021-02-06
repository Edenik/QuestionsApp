import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { CelebrateComponent } from './modules/shared/celebrate/celebrate.component';
import { CreateQuestionComponent } from './admin/questions/create-question/create-question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HeaderComponent } from './admin/header/header.component';
import { QuestionsListComponent } from './admin/questions/questions-list/questions-list/questions-list.component';

const matModules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
];
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CelebrateComponent,
    CreateQuestionComponent,
    HeaderComponent,
    QuestionsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    ...matModules,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
