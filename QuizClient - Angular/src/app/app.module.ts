import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { CelebrateComponent } from './modules/shared/celebrate/celebrate.component';
import { CreateQuestionComponent } from './admin/questions/create-question/create-question.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CelebrateComponent,
    CreateQuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
