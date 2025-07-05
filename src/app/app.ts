import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Component } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { Chatbot } from './components/chatbot/chatbot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'money-wallet-project';
  showSidebar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hideOnRoutes = ['/login', '/signup'];
        this.showSidebar = !hideOnRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}
