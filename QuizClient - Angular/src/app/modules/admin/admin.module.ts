import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { QuestionsModule } from './questions/questions.module';

@NgModule({
  imports: [AdminRoutingModule, QuestionsModule],
})
export class AdminModule {}
