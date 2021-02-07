import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AdminPanelComponent } from 'src/app/admin/admin-panel/admin-panel.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuthAdminGuard } from './authAdmin.guard';

const routes: Routes = [
  // { path: '', component: AdminPanelComponent },
  {
    path: '',
    loadChildren: () =>
      import('./questions/questions.module').then((m) => m.QuestionsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthAdminGuard],
})
export class AdminRoutingModule {}
