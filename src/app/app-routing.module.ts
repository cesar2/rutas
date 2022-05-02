import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerAppComponent } from './components/pages/container-app/container-app.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { DetailsPostComponent } from './components/posts/details-post/details-post.component';
import { MackayComponent } from './components/posts/mackay/mackay.component';

const routes: Routes = [
  {
    path: '', 
    component: ContainerAppComponent,
    canActivate: [AuthGuard], // Comentar esta linea cuando quiera que cualquier usuario acceda
    children: [
      { path: '', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule) },
      { path: 'mackay', component: MackayComponent, },
      { path: 'post/:urlTitle', component: DetailsPostComponent, },
      { path: 'about', loadChildren: () => import('./components/pages/about/about.module').then(m => m.AboutModule) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },

  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },
  { path: 'login', loadChildren: () => import('./components/auth/login/login.module').then(m => m.LoginModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
