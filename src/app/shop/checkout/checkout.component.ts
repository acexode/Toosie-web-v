import { Router } from "@angular/router";
import { locationList } from "./locations";
import { AuthService } from "./../../core/service/auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { IPayPalConfig, ICreateOrderRequest } from "ngx-paypal";
import { environment } from "../../../environments/environment";
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { ToastrService } from "ngx-toastr";
declare var PaystackPop;
@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup;
  public products: Product[] = [];
  public payPalConfig?: IPayPalConfig;
  public payment: string = "POD";
  public amount: any;
  public defaultAmount: any;
  deliveryType = 'delivery';
  public user: any;
  priorityDelivery = false;
  allLocations = locationList;
  reference: string;
  paystackBtn = {
    padding: '14px',
    background: '#0281b2',
    width: '100%',
    ['border-radius']: '8px',
    ['font-weight']: 'bold',
    ['font-size']: '16px',
  };
  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    public authS: AuthService,
    public router: Router,
    private toast: ToastrService,
    private orderService: OrderService
  ) {
    this.checkoutForm = this.fb.group({
      fullName: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"),
        ],
      ],
      phone: ["", [Validators.required, Validators.pattern("[0-9]+")]],
      email: ["", [Validators.required, Validators.email]],
      address: ["", [Validators.required, Validators.maxLength(50)]],
      city: ["", Validators.required],
      state: ["", Validators.required],
      paymentMethod: ["card", [Validators.required]],
      deliveryType: ["delivery", [Validators.required]],
    });
  }

  ngOnInit() {
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.user = this.authS.currentUser();
    console.log("hello world", this.user);
    this.checkoutForm.patchValue({
      fullName: this.user.fullName,
      email: this.user.email,
      phone: this.user.phone,
    });
    this.productService.cartItems.subscribe(
      (response) => (this.products = response)
    );
    console.log(this.products);
    this.getTotal.subscribe((amount) => (this.amount = amount));
    this.checkoutForm.get("state").valueChanges.subscribe((v) => {
      this.allLocations = locationList.filter((e) => {
        return e.state === v;
      });
    });
    this.checkoutForm.get("city").valueChanges.subscribe((v) => {
      this.getTotal.subscribe((amount) => (this.amount = amount));
      this.amount += this.allLocations.filter((f) => f.label === v)[0].value;
      this.defaultAmount = this.amount;
      console.log(v);
      console.log(this.amount);
    });
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  makePayment(paymentId = null) {
    const values = {
      ...this.checkoutForm.value,
      paymentMethod: this.payment.toLowerCase(),
      priorityDelivery: this.priorityDelivery,
      paymentId
    };
    console.log(this.products);
    this.orderService.createOrder(
      this.products,
      values,
      this.user._id,
      this.amount
    );
    // this.router.navigate(['shop/checkout/success/1'])
  }

  addPriority() {
    if (this.priorityDelivery) {
      const deliveryState = this.checkoutForm.get("state").value;
      this.amount = this.defaultAmount;
      // const city = this.checkoutForm.get("city").value;
      // this.amount += this.allLocations.filter((f) => f.label === city)[0].value;

      if (deliveryState !== "" && deliveryState !== null) {
        this.amount += deliveryState === "Abuja"
            ? 1000
            : deliveryState === "Lagos"
            ? 1500
            : 500;
      } else {
        this.toast.error("You have to select delivery state");
      }
    } else {
      this.amount = this.defaultAmount;
      // const city = this.checkoutForm.get("city").value;
      // this.amount += this.allLocations.filter((f) => f.label === city)[0].value;
    }
    console.log(this.priorityDelivery);
  }
  get paymentMethod() {
    return this.checkoutForm.get('paymentMethod');
  }

  payWithPaystack() {
    var handler = PaystackPop.setup({
      key: 'pk_live_8fa45918feaa0925713ae746c8ae810b67462b3a', // Replace with your public key
      email: this.user.email,
      channels: ['card', 'bank', 'bank_transfer'],
      amount: this.amount * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
      currency: 'NGN', // Use GHS for Ghana Cedis or USD for US Dollars
      ref: this.reference, // Replace with a reference you generated
      callback: function(response) {
        //this happens after the payment is completed successfully
        const reference = response.reference;
        this.makePayment(reference);
        alert('Payment complete! Reference: ' + reference);

      },
      onClose: function() {
        alert('Transaction was not completed, window closed.');
      },
    });
    handler.openIframe();
  }
}
