import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  
import { HeaderComponent } from './header/header.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-header></app-header>  
    <router-outlet></router-outlet>  
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, HeaderComponent] 
})
export class AppComponent {
  title = 'MOCO UI - LAP Projekt';
}
