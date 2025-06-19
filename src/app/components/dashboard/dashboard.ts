import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Myservice } from '../../services/myservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  encapsulation: ViewEncapsulation.None,
})
export class Dashboard implements OnInit {
  constructor(private router: Router, private myservice: Myservice) {}
  balance: number = 0;

  ngOnInit() {
    const phoneNumber = sessionStorage.getItem('number');
    if (phoneNumber) {
      this.myservice.Balanceinfo(phoneNumber).subscribe((data) => {
        this.balance = data.result.amount; // Correctly extract amount from result
      });
    }
  }

  addMoney() {
    this.router.navigate(['/addmoney']);
  }

  transferMoney() {
    this.router.navigate(['/payment']);
  }
  viewTransactionHistory() {
    this.router.navigate(['/transactionhistory']);
  }
  logout() {
    sessionStorage.removeItem('number');
    this.router.navigate(['/login']);
  }
  isSidebarVisible = false;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
