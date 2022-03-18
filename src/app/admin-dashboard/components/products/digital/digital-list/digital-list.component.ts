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
      position: 'right'
    },
    columns: {
      id: {
        title: 'Id',
      },
      img: {
        title: 'Product',
        type: 'html',
      },
      title: {
        title: 'Product Title'
      },
      currentPrice: {
        title: 'Price',
      },
      discountPercent: {
        title: 'Discount',
      }
    },
  };

  ngOnInit() { 
    this.invS.allCategories().subscribe((e:any) =>{
      this.categories = e.inventoryCategory
      const baby = this.categories[0]
      console.log(e)
      this.invS.inventoryByCategory(baby.id).subscribe((inv:any) =>{
        console.log(inv)
        this.products = inv.inventory.map(e =>{
          return {
            ...e,
            img: `<img src=${e?.resourceImages[0]} class='imgTable'>`
          }
        })
      })
    })
  }

}
