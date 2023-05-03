import { IProducts } from './../../../../../core/model/product.interface';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { digitalListDB } from 'src/app/admin-dashboard/shared/tables/digital-list';
import { ExportServiceService } from 'src/app/core/service/export-service/export-service.service';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';
@Component({
  selector: 'app-digital-list',
  templateUrl: './digital-list.component.html',
  styleUrls: ['./digital-list.component.scss']
})
export class DigitalListComponent implements OnInit {
  public digital_list = []
  public categories = []
  public products = []
  public exportProduct = []

  constructor(private invS: InventoryService, private exportS: ExportServiceService,
    private toastrService: ToastrService,) {
    this.digital_list = digitalListDB.digital_list;
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
     
      img: {
        title: 'Product',
        type: 'html',
      },
      title: {
        title: 'Product Title'
      },
      actualPrice: {
        title: 'Price  ₦',
      },
      stock: {
        title: 'Total in Stock',
      },
      discountPercent: {
        title: 'Discount %',
      },
      id: {
        title: '',
        type: 'html',
        filter: false
      },
    },
  };

  ngOnInit() { 
    this.invS.allCategories().subscribe((e:any) =>{
      this.categories = e.data
    })
    this.invS.getInventory().subscribe((inv:any) =>{
      console.log(inv)
      this.products = inv.data.map(e =>{
        return {
          ...e,
          id: `
          <a href=dashboard/main/products/edit-product/${e._id} class="ng2-smart-action ng2-smart-action-edit-edit ng-star-inserted"><a/>
          `,
          img: `<img src=${e?.resourceImages[0]} class='imgTable'>`
        }
      })
      this.exportProduct = inv.data.map((e: IProducts) =>{
        return {
         ['title']: e.title,
         ['Actual Price']: e.actualPrice,
         ['Discount %']: e.discountPercent,
         ['Stock']: e.stock,
         ['Tags']: e?.tags.join(', '),
         ['Brand']: e.brand,
         ['Description']: e.description,
         ['Product Images']: e.resourceImages.join(', '),
         ['Ingredients']: e.ingredients,
         ['Warnings']: e.warning,
        }
      })
    })
  }
  onCustom(event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
  }
  onDeleteConfirm(event) {
    console.log("Delete Event In Console")
    console.log(event);
    if (window.confirm('Are you sure you want to delete?')) {
      this.invS.deleteInventory(event.data._id).subscribe(e =>{
        event.confirm.resolve();
        console.log(e)

      })
    } else {
      event.confirm.reject();
    }
  }

  exportToXlsx(){
    if(this.exportProduct.length > 0){
      const headings = Object.keys(this.exportProduct[0])

      this.exportS.exportToExcel([headings], this.exportProduct, 'Toosie-Pharmacy-Products')

    }else{
      this.toastrService.error("Nothing to export");
    }
  }

}
