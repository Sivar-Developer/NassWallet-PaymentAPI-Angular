import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(
    public paymentService: PaymentService
  ) { }

  ngOnInit(): void {
  }

  makePayment() {
    this.paymentService.makePayment()
  }

}
