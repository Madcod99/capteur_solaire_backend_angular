import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatistiqueComponent } from './statistique/statistique.component';
import { TableauComponent } from './tableau/tableau.component';


const routes: Routes = [
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/tableau', component: TableauComponent },
  { path: 'dashboard/statistiques', component: StatistiqueComponent },
  { path: '**', pathMatch:"full", component: TableauComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
