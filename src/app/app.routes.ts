import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Dashboard } from './components/dashboard/dashboard';
import { Addmoney } from './components/addmoney/addmoney';
import { TransactionHistory } from './components/transaction-history/transaction-history';
import { Payment } from './components/payment/payment';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard },
  { path: 'addmoney', component: Addmoney },
  { path: 'transactionhistory', component: TransactionHistory },
  { path: 'payment', component: Payment },
];
