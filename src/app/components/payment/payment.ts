import { Component, OnInit } from '@angular/core';
import {
  Myservice,
  transferMoneyModel,
  userlistResponse,
} from '../../services/myservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
  userPhonenumber: any;

  constructor(private myservice: Myservice) {}

  transferMoneyModel = new transferMoneyModel();
  userDetails = new userlistResponse();
  userlist: any;

  ngOnInit(): void {
    this.userPhonenumber = sessionStorage.getItem('number');
    this.getAllUsers();
  }

  getAllUsers() {
    this.myservice.getUserList().subscribe((data) => {
      this.userlist = data.result;
    });
  }
  sendMoney() {
    this.transferMoneyModel.senderPhoneNumber = this.userPhonenumber;
    this.myservice.transferMoney(this.transferMoneyModel).subscribe((data) => {
      console.log(data.result);
      console.log(data.response);
      alert(data.response);
    });
  }
}
