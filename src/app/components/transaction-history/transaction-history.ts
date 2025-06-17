import { Component, OnInit } from '@angular/core';
import {
  Myservice,
  transactionhistoryModel,
  transferMoneyModel,
} from '../../services/myservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css',
})
export class TransactionHistory {
  transactions: any[] = []; // All transactions from API
  recentTransactions: any[] = []; // Filtered recent transactions
  showAllTransactions: boolean = false; // Toggle between recent and all

  constructor(private myservice: Myservice) {}

  ngOnInit() {
    this.getTransactions();
  }

  getTransactions() {
    // Create empty model object to pass to service
    const requestData = new transactionhistoryModel();

    this.myservice.gettransactionhistory(requestData).subscribe({
      next: (data: any) => {
        console.log('API Response:', data);

        // If API returns array directly
        if (Array.isArray(data)) {
          this.transactions = data;
        }
        // If API returns object with result property
        else if (data && data.result) {
          this.transactions = data.result;
        }
        // If API returns single object, put it in array
        else if (data) {
          this.transactions = [data];
        }

        // Filter to show only recent transactions (last 30 days)
        this.filterRecentTransactions();
      },
      error: (error: any) => {
        console.error('API Error:', error);
        alert('Error loading transactions. Check console for details.');
      },
    });
  }

  // Calculate total money received
  getTotalReceived(): number {
    const transactionsToUse = this.showAllTransactions
      ? this.transactions
      : this.recentTransactions;
    return transactionsToUse
      .filter((txn) => txn.transactionType === 'credit')
      .reduce((total, txn) => total + (txn.transferAmount || 0), 0);
  }

  // Calculate total money sent
  getTotalSent(): number {
    const transactionsToUse = this.showAllTransactions
      ? this.transactions
      : this.recentTransactions;
    return transactionsToUse
      .filter((txn) => txn.transactionType === 'debit')
      .reduce((total, txn) => total + (txn.transferAmount || 0), 0);
  }

  // Filter transactions to show only last 30 days
  filterRecentTransactions(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.recentTransactions = this.transactions.filter((txn) => {
      const transactionDate = new Date(txn.transactionDate);
      return transactionDate >= thirtyDaysAgo;
    });

    // Sort by date (newest first)
    this.recentTransactions.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );
  }

  // Get transactions to display based on toggle
  getDisplayTransactions(): any[] {
    return this.showAllTransactions
      ? this.transactions
      : this.recentTransactions;
  }

  // Toggle between recent and all transactions
  toggleView(): void {
    this.showAllTransactions = !this.showAllTransactions;
  }
}
