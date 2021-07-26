import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardguardGuard } from './guard/dashboardguard.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path : '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component :HomeComponent},
  {path: 'register', component :RegisterComponent},
  {path: 'login', component :LoginComponent},
  {path : 'dashboard/:id', canActivate:[DashboardguardGuard], component:DashboardComponent},
  {path : '**', component: NotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
