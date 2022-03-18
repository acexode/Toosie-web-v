import { miscEndpoint } from './../../../../../core/config/endpoints';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';
import * as Dropzone from 'dropzone';
@Component({
  selector: 'app-digital-add',
  templateUrl: './digital-add.component.html',
  styleUrls: ['./digital-add.component.scss']
})
export class DigitalAddComponent implements OnInit {
  public digital_list = []
  public categories = []
  public products = []
  min: any = 0;
  max: any = 0; 
  productPage = true
  productForm: FormGroup;
  hide = true;
  loading = false;
  files: File[] = [];
  public config1: DropzoneConfigInterface = {
    clickable: true,
    url: 'https://github.com/dropzone/dropzone/issues/862',
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  constructor(private invS: InventoryService, private fb: FormBuilder) {
    // Dropzone.autoDiscover = false;
    this.productForm = this.fb.group({
      category: ['', [Validators.required]],
      title: ['', [Validators.required] ],
      description: ['', [Validators.required ]],
      actualPrice: ['', [Validators.required ]],
      discountPercent: [0, [Validators.required, ]],
      tags: ['', [Validators.required, ]],
      brand: ['', [Validators.required, ]],
    });
  }

  

  public onUploadInit(args: any): void { }

  public onUploadError(args: any): void { }

  public onUploadSuccess(args: any): void {
    console.log(args)
   }

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
  saveProduct(){
    this.loading = true
    var data = new FormData();
    data.append('category', '60c2269a3c3097745554235f');
    data.append('title', this.title?.value);
    data.append('description', this.description?.value);
    data.append('actualPrice', this.actualPrice?.value);
    data.append('discountPercent', '0');
    data.append('images', JSON.stringify(this.files));
    data.append('tags', this.tags?.value);
    data.append('brand', this.brand?.value);
    this.invS.createInventory(data).subscribe(inv =>{
      console.log(inv)
      this.loading = false;
      this.files = []
      this.productForm.reset()
    })
  }
  get title() {
    return this.productForm.get('title');
  }
  get category() {
    return this.productForm.get('category');
  }
  get description() {
    return this.productForm.get('description');
  }
  get actualPrice() {
    return this.productForm.get('actualPrice');
  }
  get discountPercent() {
    return this.productForm.get('discountPercent');
  }
  get images() {
    return this.productForm.get('images');
  }
  get tags() {
    return this.productForm.get('tags');
  }
  get brand() {
    return this.productForm.get('brand');
  }

}
