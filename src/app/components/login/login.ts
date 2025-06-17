import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  password: any;
  showPassword = false;
  isLoading = false;

  constructor(private router: Router, private myservice: Myservice) {}
  loginModel = new LoginInfo();
  userlogin: any;

  Onsubmit() {
    this.myservice.login(this.loginModel).subscribe((data) => {
      this.userlogin = data.result;
      console.log(data);
      sessionStorage.setItem('number', this.userlogin.phoneNumber);
      alert(data.response);
      this.router.navigate(['/dashboard']);
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
