import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ProviderComponent } from './features/provider/provider-dashboard/provider-dashboard';
import { AdminComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { ModeratorComponent } from './features/moderator/moderator-dashboard/moderator-dashboard';
import { ClientComponent } from './features/client/client-dashboard/client-dashboard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'client-dashboard',
    component: ClientComponent,
    canActivate: [authGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'provider',
    component: ProviderComponent,
    canActivate: [authGuard],
    data: { roles: ['provider'] }
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'moderator',
    component: ModeratorComponent,
    canActivate: [authGuard],
    data: { roles: ['moderator'] }
  }

];
