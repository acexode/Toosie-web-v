import { ActivatedRoute } from '@angular/router';
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
  editProduct: any = {}
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
  constructor(private invS: InventoryService, private fb: FormBuilder, private route: ActivatedRoute) {
    // Dropzone.autoDiscover = false;
    this.productForm = this.fb.group({
      category: ['', [Validators.required]],
      title: ['', [Validators.required] ],
      description: ['', [Validators.required ]],
      // shortSummary: ['', [Validators.required ]],
      enabled: [false, [Validators.required ]],
      isSpecial: [false, [Validators.required ]],
      isTrending: [false, [Validators.required ]],
      stock: [0, [Validators.required ]],
      actualPrice: [0, [Validators.required ]],
      discountPercent: [0, [Validators.required, ]],
      tags: ['', [Validators.required, ]],
      brand: ['', [Validators.required, ]],
    });
  }

  

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  ngOnInit() {
    const catId = this.route.snapshot.params.id
    console.log(this.route.snapshot.params.id)
    if(catId){
      this.invS.singleInventory(catId).subscribe((e: any) =>{
        console.log(e)
        const product = e.data
        this.editProduct = e.data
        this.productForm.patchValue({
          ...product
        })
      })
    }
    this.invS.allCategories().subscribe((e:any) =>{
      this.categories = e.data
      const baby = this.categories[0]
    })
  }
  saveProduct(){
    this.loading = true
    var data = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      data.append('upload', this.files[i], this.files[i].name)
    }
    ;
    this.invS.uploadMedia(data).subscribe(inv =>{
      const obj = {
        ...this.productForm.value,
        resourceImages: inv.images,
        tags: this.tags.value.split(","),
        actualPrice: parseInt(this.actualPrice.value,10),
        stock: parseInt(this.stock.value,10)
      }
      this.invS.createInventory(obj).subscribe(res =>{
        console.log(res)
        this.loading = false;
        this.files = []
        this.productForm.reset()
      })
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
  get stock() {
    return this.productForm.get('stock');
  }

}
