import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { QuestionsModule } from './questions/questions.module';
import { UsersModule } from './users/users.module';

@NgModule({
  imports: [AdminRoutingModule, QuestionsModule, UsersModule],
})
export class AdminModule {}
