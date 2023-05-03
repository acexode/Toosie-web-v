import { OrderService } from "./../../../../shared/services/order.service";
import { InventoryService } from "src/app/core/service/inventory/inventory.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { ToastrService } from "ngx-toastr";
import { ExportServiceService } from "src/app/core/service/export-service/export-service.service";
@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  public order = [];
  lagosOrder = [];
  abujaOrder = [];
  priorityOrder = [];
  kanoOrder = [];
  pendingDelivery = [];
  pendingPayment = [];
  completedOrder = [];
  public temp = [];
  public mainOrder = [];

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  constructor(
    private orderS: OrderService,
    private exportS: ExportServiceService,
    private toastrService: ToastrService
  ) {
    // this.order = orderDB.list_order;
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
      this.mainOrder = res.data;
      console.log(res);
      this.lagosOrder = this.formatData(
        res.data.filter(
          (e) =>
            e.shipping?.city?.trim().toLowerCase() === "lagos" ||
            e.shipping?.state?.trim().toLowerCase() === "lagos"
        )
      );
      this.abujaOrder = this.formatData(
        res.data.filter(
          (e) =>
            e.shipping?.city?.trim().toLowerCase() === "abuja" ||
            e.shipping?.state?.trim().toLowerCase() === "abuja"
        )
      );
      this.kanoOrder = this.formatData(
        res.data.filter(
          (e) =>
            e.shipping?.city?.trim().toLowerCase() === "kano" ||
            e.shipping?.state?.trim().toLowerCase() === "kano"
        )
      );
      this.priorityOrder = this.formatData(
        res.data.filter((e) => e.priorityDelivery === true)
      );
      this.pendingPayment = this.formatData(
        res.data.filter((e) => e.paymentStatus === 'pending')
      );
      this.pendingDelivery = this.formatData(
        res.data.filter((e) => e.deliveryStatus === 'pending')
      );
      this.completedOrder = this.formatData(
        res.data.filter((e) => e.deliveryStatus === 'delivered')
      );
      console.log(this.lagosOrder, "lag");
      console.log(this.abujaOrder, "abuja");
      console.log(this.kanoOrder, "kano");

      this.order = res.data.map((e) => {
        return {
          id: e._id,
          ["Payment Id"]: e.paymentId.slice(0, 8),
          ["Payment Method"]:
            e.paymentMethod === "pod"
              ? "Payment on Delivery"
              : this.toTitleCase(e.paymentMethod),
          ["Payment Status"]: this.toTitleCase(e.paymentStatus),
          ["Delivery Status"]: this.toTitleCase(e.deliveryStatus),
          ["Products"]: e.products.map((s) => s.title).join(", "),
          ["Total Cost"]: e.totalCost,
        };
      });
      console.log(this.order);
    });
  }

  productFactory(p, product) {
    return p.map((e, i) => {
      return `<span><b> ${e?.quantity}</b> ${product[i]?.title}  </span>`;
    });
  }

  formatData(res) {
    if (res.length > 0) {
      return res.map((e) => {
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
    } else {
      return [];
    }
  }

  onEditConfirm(event) {
    if (window.confirm("Are you sure you want to update?")) {
      const { id, ...res } = event.newData;
      const edit = this.mainOrder.filter((o) => o.id === id)[0];
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
  exportToXlsx() {
    if (this.order.length > 0) {
      const headings = Object.keys(this.order[0]);

      this.exportS.exportToExcel([headings], this.order, 'Toosie-Pharmacy-order');
    } else {
      this.toastrService.error("Nothing to export");
    }
  }
}
