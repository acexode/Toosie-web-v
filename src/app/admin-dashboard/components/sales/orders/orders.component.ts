import { OrderService } from "./../../../../shared/services/order.service";
import { InventoryService } from "src/app/core/service/inventory/inventory.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  public order = [];
  public temp = [];
  public mainOrder = [];

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(
    private orderS: OrderService,
    private toastrService: ToastrService
  ) {
    this.order = orderDB.list_order;
    console.log(this.order);
  }
  public settings = {
    actions: {
      edit: true,
      add: false,
      position: "right",
    },
    delete: {
      confirmDelete: true,

      deleteButtonContent: "Delete data",
      saveButtonContent: "save",
      cancelButtonContent: "cancel",
    },
    edit: {
      editButtonContent: `'<i class="fas fa-pencil-alt fa-fw mx-2"></i>'`,
      saveButtonContent: '<i class="fa fa-check-circle mx-2"></i>',
      cancelButtonContent: '<i class="fas fa-times fa-fw mx-2"></i>',
      confirmSave: true,
    },
    columns: {
      paymentId: {
        title: "Transaction ID",
      },
      products: {
        title: "Product",
        type: "html",
      },
      paymentStatus: {
        title: "Payment Status",
        type: "html",
        editor: {
          type: "list",
          config: {
            list: [
              { value: "pending", title: "Pending" },
              { value: "paid", title: "Paid" },
            ],
          },
        },
      },
      paymentMethod: {
        title: "Payment Method",
      },
      deliveryStatus: {
        title: "Order Status",
        editor: {
          type: "list",
          config: {
            list: [
              { value: "pending", title: "Pending" },
              { value: "delivered", title: "Delivered" },
            ],
          },
        },
      },
      totalCost: {
        title: "Total in Stock",
      },
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
    this.loadData();
  }

  loadData() {
    this.orderS.getAllOrders().subscribe((res: any) => {
      this.mainOrder = res.data
      this.order = res.data.map((e) => {
        console.log(e);
        return {
          id: e._id,
          paymentId: e.paymentId.slice(0, 8),
          paymentMethod:
            e.paymentMethod === "pod"
              ? "Payment on Delivery"
              : this.toTitleCase(e.paymentMethod),
          paymentStatus: this.toTitleCase(e.paymentStatus),
          deliveryStatus: this.toTitleCase(e.deliveryStatus),
          products: this.productFactory(e.orderDetails, e.products),
          totalCost: e.totalCost,
        };
      });
      console.log(this.order);
    });
  }

  productFactory(p, product) {
    return p.map((e, i) => {
      return `<span><b> ${e?.quantity}</b> ${product[i].title}  </span>`;
    });
  }

  onEditConfirm(event) {
    if (window.confirm("Are you sure you want to update?")) {
      const { id, ...res } = event.newData;
      const edit = this.mainOrder.filter(o => o.id === id)[0];
      const newObj = {
        deliveryStatus: res.deliveryStatus.toLowerCase(),
        paymentStatus: res.paymentStatus.toLowerCase(),
        paymentMethod:
          res.paymentMethod === "Payment on Delivery" ? "pod" : "card",
      };
      this.orderS.updateOrder(id, newObj).subscribe((e) => {
        this.loadData();
        this.toastrService.success("Order has been updated");
      });
    } else {
      event.confirm.reject();
    }
  }
  onDeleteConfirm(event) {
    if (window.confirm("Are you sure you want to delete this order?")) {
      console.log(event);
      const { id } = event.data;
      this.orderS.deleteOrder(id).subscribe((e) => this.loadData());
      this.toastrService.success("Order has been deleted");
    } else {
      event.confirm.reject();
    }
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
