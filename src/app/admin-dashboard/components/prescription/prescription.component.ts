import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { IProducts } from "src/app/core/model/product.interface";
import { ExportServiceService } from "src/app/core/service/export-service/export-service.service";
import { InventoryService } from "src/app/core/service/inventory/inventory.service";
import { digitalListDB } from "../../shared/tables/digital-list";
import { PrescriptionService } from "src/app/core/service/prescription/prescription.service";
import { EditPrescriptionComponent } from "./edit-prescription/edit-prescription.component";

@Component({
  selector: "app-prescription",
  templateUrl: "./prescription.component.html",
  styleUrls: ["./prescription.component.scss"],
})
export class PrescriptionComponent implements OnInit {
  public digital_list = [];
  public categories = [];
  public products = [];
  public exportPrescription = [];
  public prescriptions = [];

  constructor(
    private invS: InventoryService,
    private exportS: ExportServiceService,
    private presC: PrescriptionService,
    private toastrService: ToastrService
  ) {
    this.digital_list = digitalListDB.digital_list;
  }

  public settings = {
    actions: {
      edit: false,
      add: false,
      delete: true,
      position: "right",
    },
    delete: {
      confirmDelete: true,

      deleteButtonContent: "Delete data",
      saveButtonContent: "save",
      cancelButtonContent: "cancel",
    },
    columns: {
      customerId: {
        title: "Customer Name",
      },
      email: {
        title: "Customer Email",
      },
      img: {
        title: "Image",
        type: "html",
      },
      description: {
        title: "Description",
      },
      createdAt: {
        title: "Created At",
      },
      // id: {
      //   title: '',
      //   type: 'html',
      //   filter: false
      // },
      action: {
        filter: false,
        type: "custom",
        renderComponent: EditPrescriptionComponent,
        // editor: {
        //   type: 'custom',
        //   component: EditCategoryComponent,
        // },
      },
    },
  };

  ngOnInit() {
    this.presC.allPrescriptions().subscribe((v) => {
      console.log(v);
      this.prescriptions = v.data.map((e) => {
        return {
          ...e,
          createdAt: new Date(e.createdAt).toDateString(),
          customerId: e.customerId?.fullName,
          email: e.customerId?.email,
          // id: `
          // <a href=dashboard/main/products/edit-product/${e._id} class="ng2-smart-action ng2-smart-action-edit-edit ng-star-inserted"><a/>
          // `,
          img: `<img src=${e?.prescriptionImage} class='imgTable'>`,
        };
      });

      this.exportPrescription = v.data.map((e) => {
        return {
          Customer: e.customerId?.fullName,
          Email: e.customerId?.email,
          ["Description"]: e.description,
          ["Image"]: e.prescriptionImage,
          ["Created At"]: new Date(e.createdAt).toDateString(),
        };
      });
      console.log(this.exportPrescription);
    });
  }
  onCustom(event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
  }
  onDeleteConfirm(event) {
    console.log(event);
    if (window.confirm("Are you sure you want to delete?")) {
      this.presC.deletePrescriptions(event.data._id).subscribe((e) => {
        event.confirm.resolve();
        this.toastrService.success("Prescription deleted successfully");
      }, err => {
        this.toastrService.error("Unable to delete prescription");
      });
    } else {
      event.confirm.reject();
    }
  }

  exportToXlsx() {
    if (this.exportPrescription.length > 0) {
      const headings = Object.keys(this.exportPrescription[0]);

      this.exportS.exportToExcel(
        [headings],
        this.exportPrescription,
        "Toosie-Pharmacy-Products"
      );
    } else {
      this.toastrService.error("Nothing to export");
    }
  }
}
