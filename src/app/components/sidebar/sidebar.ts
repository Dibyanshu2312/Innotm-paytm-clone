import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private router: Router) {}
  addMoney1() {
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

  showSidebar = false;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('show', this.showSidebar);
    }
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
