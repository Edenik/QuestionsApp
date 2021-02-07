import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthAdminGuard } from './core/guards/authAdmin.guard';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/modules/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./core/modules/questions.module').then((m) => m.QuestionsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthAdminGuard],
})
export class AppRoutingModule {}
