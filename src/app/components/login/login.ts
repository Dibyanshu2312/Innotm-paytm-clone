import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginInfo, Myservice } from '../../services/myservice';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  @Output() loginEvent = new EventEmitter<boolean>();

  showPassword = false;
  isLoading = false;
  loginModel = new LoginInfo();
  userlogin: any;

  constructor(private router: Router, private myservice: Myservice) {}

  Onsubmit() {
    this.isLoading = true;
    this.myservice.login(this.loginModel).subscribe(
      (data) => {
        this.userlogin = data.result;
        console.log(data);
        sessionStorage.setItem('number', this.userlogin.phoneNumber);
        alert(data.response);
        this.loginEvent.emit(true); // Emit event to parent
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      (error) => {
        alert('Login failed');
        this.isLoading = false;
      }
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
