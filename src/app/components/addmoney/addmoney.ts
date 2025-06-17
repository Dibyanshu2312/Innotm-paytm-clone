import { Component } from '@angular/core';
import { AddMoneyInfo, Myservice } from '../../services/myservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addmoney',
  imports: [FormsModule, CommonModule],
  templateUrl: './addmoney.html',
  styleUrl: './addmoney.css',
})
export class Addmoney {
  userphoneNumber: any;
  addMoneyModel = new AddMoneyInfo();

  constructor(private myservice: Myservice) {}

  ngOnInit() {
    this.userphoneNumber = sessionStorage.getItem('number');
  }

  addMoney() {
    this.addMoneyModel.phoneNumber = this.userphoneNumber;
    this.myservice.addMoney(this.addMoneyModel).subscribe((data) => {
      console.log(data);
      alert(data.response);
    });
  }
}
