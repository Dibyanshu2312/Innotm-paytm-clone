import { Component } from '@angular/core';
import { AddMoneyInfo, Myservice } from '../../services/myservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-addmoney',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './addmoney.html',
  styleUrl: './addmoney.css',
})
export class Addmoney {
  userphoneNumber: any;
  addMoneyModel = new AddMoneyInfo();
  balance: any;

  constructor(private myservice: Myservice, private router: Router) {}

  ngOnInit() {
    this.userphoneNumber = sessionStorage.getItem('number');
    const phoneNumber = sessionStorage.getItem('number');
    if (phoneNumber) {
      this.myservice.Balanceinfo(phoneNumber).subscribe((data) => {
        this.balance = data.result.amount; // Correctly extract amount from result
      });
    }
  }

  addMoney() {
    this.addMoneyModel.phoneNumber = this.userphoneNumber;
    this.myservice.addMoney(this.addMoneyModel).subscribe((data) => {
      console.log(data);
      alert(data.response);
    });
  }
}
