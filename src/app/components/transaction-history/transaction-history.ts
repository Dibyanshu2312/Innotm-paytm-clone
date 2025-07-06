import { Component, OnInit, TemplateRef } from '@angular/core';
import { Myservice } from '../../services/myservice';
import { CommonModule, NgIfContext } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-transaction-history',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    BadgeModule,
    ButtonModule,
  ],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css',
})
export class TransactionHistory implements OnInit {
  transactions: any[] = [];
  username: string = '';
  noData: TemplateRef<NgIfContext<boolean>> | null | undefined;

  constructor(private myservice: Myservice, private router: Router) {}

  ngOnInit() {
    this.username = sessionStorage.getItem('number') || '';
    console.log('Phone number from session:', this.username);
    this.getTransactions();
  }

  getTransactions() {
    if (!this.username) {
      console.error('No phone number found in session');
      alert('Please login again');
      return;
    }

    console.log('Getting transactions for phone:', this.username);
    this.myservice.gettransactionhistory(this.username).subscribe({
      next: (data: any) => {
        console.log('API Response:', data);

        if (Array.isArray(data)) {
          this.transactions = data;
        } else if (data?.result && Array.isArray(data.result)) {
          this.transactions = data.result;
        } else if (data?.data && Array.isArray(data.data)) {
          this.transactions = data.data;
        } else if (data) {
          this.transactions = [data];
        } else {
          this.transactions = [];
        }

        console.log('Processed transactions:', this.transactions);
        this.updatePagination(); // ✅ Important
      },
      error: (error: any) => {
        console.error('Error loading transactions:', error);
        alert('Failed to load transactions. Check console for details.');
      },
    });
  }

  deleteTransaction(transactionId: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.myservice.deleteTransactionById(transactionId).subscribe({
        next: (response: any) => {
          console.log('Delete response:', response);
          alert('Transaction deleted successfully');
          this.getTransactions();
        },
        error: (error: any) => {
          console.error('Delete error:', error);
          alert('Failed to delete transaction');
        },
      });
    }
  }

  deleteAllTransactions() {
    if (
      confirm(
        'Are you sure you want to delete ALL transactions? This cannot be undone!'
      )
    ) {
      this.myservice.deleteAllTransactions(this.username).subscribe({
        next: (response: any) => {
          console.log('Delete all response:', response);
          alert('All transactions deleted successfully');
          this.getTransactions();
        },
        error: (error: any) => {
          console.error('Delete all error:', error);
          alert('Failed to delete all transactions');
        },
      });
    }
  }
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

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  goHome() {
    this.router.navigate(['/dashboard']);
  }

  currentPage = 1;
  rowsPerPage = 5;
  paginatedTransactions: any[] = [];
  totalPages = 0;

  // Update pagination when transactions change
  updatePagination() {
    this.totalPages = Math.ceil(this.transactions.length / this.rowsPerPage);
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedTransactions = this.transactions.slice(startIndex, endIndex);
  }

  // Pagination methods
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }

  updateRowsPerPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  getCurrentPageStart() {
    return (this.currentPage - 1) * this.rowsPerPage;
  }

  getVisiblePages() {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
