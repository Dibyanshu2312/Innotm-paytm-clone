import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Myservice {
  constructor(private http: HttpClient) {}
  masterapiurl = 'https://localhost:7213';

  signup(signupInfo: SignupInfo) {
    return this.http.post<any>(
      this.masterapiurl + '/api/Auth/Register',
      signupInfo
    );
  }
  login(loginInfo: LoginInfo) {
    return this.http.post<any>(
      this.masterapiurl + '/api/Auth/Login',
      loginInfo
    );
  }

  addMoney(money: any) {
    return this.http.post<any>(this.masterapiurl + '/api/Wallet/add', money);
  }

  Balanceinfo(phoneNumber: any) {
    return this.http.get<any>(
      this.masterapiurl + '/api / Users/balance?phonenumber=' + phoneNumber
    );
  }
  getUserList(): Observable<userlistResponse> {
    return this.http.get<userlistResponse>(
      this.masterapiurl + '/api / Users/basic-list'
    );
  }
  transferMoney(transferMoney: transferMoneyModel) {
    return this.http.post<any>(
      this.masterapiurl + '/api/Transactions/pay',
      transferMoney
    );
  }
  gettransactionhistory(phoneNumber: string) {
    return this.http.get<any>(
      this.masterapiurl + `/api/Transactions/history?phoneNumber=${phoneNumber}`
    );
  }

  deleteTransactionById(transactionId: number): Observable<any> {
    return this.http.delete<any>(
      this.masterapiurl +
        '/api/Transactions/DeleteTransactionById?Tid=' +
        transactionId
    );
  }

  deleteAllTransactions(phoneNumber: string): Observable<any> {
    return this.http.delete<any>(
      this.masterapiurl +
        '/api/Transactions/DeleteHistory?phoneNumber=' +
        phoneNumber
    );
  }
}

export class SignupInfo {
  email: string | undefined;
  phoneNumber: string | undefined;
  gender: string | undefined;
  username: string | undefined;
  password: string | undefined;
}
export class LoginInfo {
  phoneNumber: string | undefined;
  password: string | undefined;
}
export class AddMoneyInfo {
  phoneNumber: string | undefined;
  amount: number | undefined;
}
export class userlistResponse {
  result!: Result[];
  response: string | undefined;
  responseCode: string | undefined;
}
export class Result {
  userId: number | undefined;
  username?: string;
  phoneNumber?: string;
}

export class transferMoneyModel {
  senderPhoneNumber: string | undefined;
  receiverPhoneNumber: string | undefined;
  amount: number | undefined;
}
export class transactionhistoryModel {
  transactionId: number | undefined;
  userId: number | undefined;
  receiverId: number | undefined;
  receiverName?: string;
  receiverPhoneNumber?: string;
  transactionType: string | undefined;
  transactionDate: string | undefined;
  initialAmount: number | undefined;
  transferAmount: number | undefined;
}
