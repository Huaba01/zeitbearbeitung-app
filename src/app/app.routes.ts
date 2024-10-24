import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { PresenceComponent } from './presence/presence.component';

export const routes: Routes = [
  { path: 'userlist', component: UserListComponent },  
  { path: 'presence', component: PresenceComponent },   
  { path: '', redirectTo: 'userlist', pathMatch: 'full' }  
];
