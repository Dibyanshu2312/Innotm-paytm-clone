import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  phoneNumber = '';
  password = '';

  showPassword = false;
  isLoading = false;

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.phoneNumber || !this.password) {
      alert('Please enter both phone number and password.');
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(
        (u: any) =>
          u.phoneNumber === this.phoneNumber && u.password === this.password
      );

      this.isLoading = false;

      if (user) {
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
        // You can store login state here if needed
        // localStorage.setItem('currentUser', JSON.stringify(user));
        // Navigate to dashboard or home
      } else {
        alert('Invalid phone number or password.');
      }
    }, 1000);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
