import { OrderService } from './../../../../shared/services/order.service';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public order = [];
  public temp = [];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(private orderS: OrderService) {
    this.order = orderDB.list_order;
    console.log(this.order)
  }
  public settings = {
    actions: {
      edit: false,
      add: false,
      position: 'right'
  },
    delete: {
      confirmDelete: true,

      deleteButtonContent: 'Delete data',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel'
    },
    edit: {
      editButtonContent: `'<i class="fas fa-pencil-alt fa-fw"></i>'`,
      saveButtonContent: '<i class="fas fa-check fa-fw"></i>',
      cancelButtonContent: '<i class="fas fa-times fa-fw"></i>',
      confirmSave: true
    },
    columns: {
     
      paymentId: {
        title: 'Transaction ID',

      },
      products: {
        title: 'Product',
        type: 'html',
      },
      paymentStatus: {
        title: 'Payment Status',
        type: 'html',
      },
      paymentMethod: {
        title: 'Product Title'
      },
      deliveryStatus: {
        title: 'Order Status',
      },
      totalCost: {
        title: 'Total in Stock',
      }
    },
  };
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.order = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit() {
    this.orderS.getAllOrders().subscribe((res: any) =>{
      console.log(res)
      this.order = res.data.map(e =>{
        return {
          ...e,
          paymentId: e.paymentId.slice(0,8),
          paymentMethod: e.paymentMethod === 'pod' ? 'Payment on Delivery' : e.paymentMethod.toUpperCase(),
          paymentStatus: e.paymentStatus.toUpperCase(),
          deliveryStatus: e.deliveryStatus.toUpperCase(),
          products: this.productFactory(e.orderDetails, e.products)
        }
      })
    })
  }

  productFactory(p, product){
    return p.map((e,i) =>{
      return `<span><b> ${e?.quantity}</b> ${product[i].title}  </span>`
    })
  }

}
