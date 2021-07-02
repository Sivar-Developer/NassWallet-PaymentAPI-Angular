import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'https://uatgw1.nasswallet.com/payment/transaction'

  // Merchant Account
  username = ''
  password = ''
  transactionPin = ''   // Merchant Account MPIN
  basicToken = 'Basic TUVSQ0hBTlRfUEFZTUVOVF9HQVRFV0FZOk1lcmNoYW50R2F0ZXdheUBBZG1pbiMxMjM='

  orderId = '1234'
  amount = '10'
  languageCode = 'en'

  isLoading = false

  constructor(
    private http: HttpClient
  ) { }

  makePayment() {
    this.isLoading = true
    this.getMerchantToken()
  }


  private getMerchantToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'authorization': this.basicToken
      })
    }

    const payload = {
      'data': {
        'username': this.username,
        'password': this.password,
        'grantType': 'password'
      }
    }

    this.http.post<any>(this.baseUrl + '/login', payload, httpOptions).subscribe((response) => {
      console.log(`Login response: ${JSON.stringify(response)}`)
      if(response.responseCode == 0) {
        let accessToken = response.data.access_token
        const payload = {
          'data': {
            'userIdentifier': this.username,
            'transactionPin': this.transactionPin,
            'orderId': this.orderId,
            'amount': this.amount,
            'languageCode': this.languageCode
          }
        }

        this.payWithNasswallet(accessToken, payload)
      }
    },
    (error) => {
      this.isLoading = false
      console.error(error)
    })
  }



  private payWithNasswallet(accessToken: string, payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'authorization': `Bearer ${accessToken}`
      })
    }

    this.http.post<any>(this.baseUrl + '/initTransaction', payload, httpOptions).subscribe((response) => {
      this.isLoading = false
      if(response.responseCode == 0 && response.data.transactionId) {
        window.location.href = `https://uatcheckout1.nasswallet.com/payment-gateway?id=${response.data.transactionId}&token=${response.data.token}&userIdentifier=${payload.data.userIdentifier}`
      }
    },
    (error) => {
      this.isLoading = false
      console.error(error)
    })
  }
}
