import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Myservice, SignupInfo } from '../../services/myservice';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  user: SignupInfo = new SignupInfo();

  isLoading = false;

  constructor(private myService: Myservice, private router: Router) {}

  onSubmit(form: SignupInfo) {
    this.isLoading = true;

    this.myService.signup(this.user).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.isLoading = false;
        alert('Signup failed. Please try again.');
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
