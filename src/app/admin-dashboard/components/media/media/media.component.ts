import { InventoryService } from "src/app/core/service/inventory/inventory.service";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-media",
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.scss"],
})
export class MediaComponent implements OnInit {
  public media = [];
  files: File[] = [];
  productForm: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder, private invS: InventoryService) {
    // this.media = mediaDB.data;
    this.productForm = this.fb.group({
      banners: this.fb.array([]),
    });
  }

  banners(): FormArray {
    return this.productForm.get("banners") as FormArray;
  }

  newBanner(): FormGroup {
    return this.fb.group({
      header: "",
      subText: "",
    });
  }

  addBanner() {
    this.banners().push(this.newBanner());
  }

  removeBanner(i: number) {
    this.banners().removeAt(i);
    this.files.splice(i, 1);
  }

  ngOnInit() {}

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    for (let index = 0; index < event.addedFiles.length; index++) {
      this.addBanner();
    }
  }

  onRemove(event) {
    console.log(event, this.files.indexOf(event));
    let index = this.files.indexOf(event);
    this.files.splice(index, 1);
    this.removeBanner(index);
  }
  onSubmit() {
    this.loading = true;
    var data = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      data.append("upload", this.files[i], this.files[i].name);
    }
    this.invS.uploadMedia(data).subscribe((inv) => {
      const obj = {
        banners: inv.images,
        text: this.productForm.get("banners").value,
      };
      console.log(this.productForm.get("banners"))
      console.log(obj)
      this.invS.createInventory(obj).subscribe((res) => {
        console.log(res);
        this.loading = false;
        this.files = [];
        this.productForm.reset();
      });
    });
  }
}
