import { baseEndpoints } from './../../core/config/endpoints';
import { RequestService } from './../../core/request/request.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

const state = {
  checkoutItems: JSON.parse(localStorage['checkoutItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private router: Router, private reqS: RequestService) { }

  // Get Checkout Items
  public get checkoutItems(): Observable<any> {
    const itemsStream = new Observable(observer => {
      observer.next(state.checkoutItems);
      observer.complete();
    });
    return <Observable<any>>itemsStream;
  }

  // Create order
  public createOrder(product: any, details: any, customerID, amount: any) {
    var item = {
        customerId: customerID,
        shipping: {
          city: details.city,
          state: details.state,
          address: details.address,
          postalCode: details.postalcode
        },
        products: product,
        totalCost: amount
    };
    // state.checkoutItems = item;
    // localStorage.setItem("checkoutItems", JSON.stringify(item));
    this.reqS.post(baseEndpoints.order, item).subscribe((e: any )=> {
      const paymentId = e.data.paymentId
      this.router.navigate(['/shop/checkout/success', paymentId]);

    })
    localStorage.removeItem("cartItems");
  }
  
}
