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
  imports: [RouterOutlet, CommonModule, RouterModule, Sidebar, Login, Chatbot],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'money-wallet-project';
  isloggedin = false;
  showSidebar = false;
  showLoginPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;

        // Show login page only for /login
        this.showLoginPage = currentUrl === '/login';

        // Show sidebar only when logged in and not on login/signup
        const hideOnRoutes = ['/login', '/signup'];
        this.showSidebar = !hideOnRoutes.includes(currentUrl);
      }
    });

    const number = sessionStorage.getItem('number');
    if (number) {
      this.isloggedin = true;
    }
  }

  received(event: boolean) {
    this.isloggedin = event;
  }
}
