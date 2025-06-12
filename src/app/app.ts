import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    Login,
    Signup,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'money-wallet-project';
}
