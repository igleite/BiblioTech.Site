import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'app',
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: '**',
    loadChildren: () => import('./modules/error/error.module').then((m) => m.ErrorModule),
  },
];
