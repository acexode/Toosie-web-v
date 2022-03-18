import { InventoryService } from 'src/app/core/service/inventory/inventory.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { digitalCategoryDB } from 'src/app/admin-dashboard/shared/tables/digital-category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-digital-category',
  templateUrl: './digital-category.component.html',
  styleUrls: ['./digital-category.component.scss']
})
export class DigitalCategoryComponent implements OnInit {
  public closeResult: string;
  public digital_categories = []
  public categories = []
  productForm: FormGroup;
  hide = true;
  loading = false;
  files: File[] = [];

  constructor(private modalService: NgbModal, private invS: InventoryService, private fb: FormBuilder) {
    this.digital_categories = digitalCategoryDB.digital_category;
    this.productForm = this.fb.group({
      title: ['', [Validators.required]],
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  public settings = {
    actions: {
      position: 'right'
    },
    columns: {
      categoryImage: {
        title: 'Image',
        type: 'html',
      },
      categoryTitle: {
        title: 'Name'
      }
    },
  };

  ngOnInit() {
    this.invS.allCategories().subscribe((e:any) =>{
      this.categories = e.inventoryCategory
    })
  }

  saveProduct(){
    this.loading = true
    var data = new FormData();
    // data.append('category', this.title?.value);
    data.append('images', JSON.stringify(this.files));
    this.invS.uploadMedia(data).subscribe(res =>{
      const obj = {
        category: this.title?.value,
        categoryImage: res?.images
      }
      this.invS.createCategory(obj).subscribe(inv =>{
        console.log(inv)
        this.loading = false;
        this.files = []
        this.productForm.reset()
      })
    })
  }

  get title() {
    return this.productForm.get('title');
  }
 
  get brand() {
    return this.productForm.get('brand');
  }

}
