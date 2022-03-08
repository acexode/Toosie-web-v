import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';
import { CategorySlider } from '../../../shared/data/slider';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  products :any[]=  [];
  categories :any[]=  [];
  fakeproducts :any[]=  [1,2,3,4,5,6];
  loading = false;
  constructor(private inventoryS: InventoryService, private route: ActivatedRoute) { }

  public CategorySliderConfig: any = CategorySlider;

  ngOnInit() {
    this.loadCategory();
  }
  loadCategory(){
    const catId = this.route.snapshot.params.slug
    console.log(catId)
    this.inventoryS.allCategories().subscribe((e: any) =>{
      console.log(e);
      this.categories = e.inventoryCategory;
      this.loadInventory(catId);
    });
  }
  loadInventory(id: any){
    console.log(id)
    this.loading = true;
    
    this.inventoryS.inventoryByCategory(id).subscribe((e: any) =>{
      console.log(e);
      this.loading = false;
      this.products = e.inventory;
    });
  }

}
