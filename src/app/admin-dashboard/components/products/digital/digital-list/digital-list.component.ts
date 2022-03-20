import { Component, OnInit } from '@angular/core';
import { digitalListDB } from 'src/app/admin-dashboard/shared/tables/digital-list';
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

  constructor(private invS: InventoryService) {
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
    })
  }
  onCustom(event) {
    alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
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

}
