import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  user = {
    email: '',
    phoneNumber: '',
    username: '',
    gender: '',
    password: '',
  };
  isLoading = false;

  constructor(private router: Router) {}

  onSubmit() {
    if (
      !this.user.email ||
      !this.user.phoneNumber ||
      !this.user.username ||
      !this.user.gender ||
      !this.user.password
    ) {
      alert('Please fill all required fields.');
      return;
    }

    this.isLoading = true;

    // Simulate async operation
    setTimeout(() => {
      // Store user in localStorage (for demo purposes)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({ ...this.user });
      localStorage.setItem('users', JSON.stringify(users));
      console.log('users', JSON.stringify(users));

      this.isLoading = false;
      alert('Account created successfully!');
      this.router.navigate(['/login']);
    }, 1000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
