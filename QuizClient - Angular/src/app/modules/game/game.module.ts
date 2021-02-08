import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CountdownModule } from 'ngx-countdown';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { GameComponent } from './board/game.component';
import { CelebrateComponent } from './celebrate/celebrate.component';
import { GameRoutingModule } from './game-routing.module';

@NgModule({
  imports: [GameRoutingModule, MaterialModule, CommonModule, CountdownModule],
  declarations: [GameComponent, CelebrateComponent],
})
export class GameModule {}
