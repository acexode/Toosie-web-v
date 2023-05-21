import { AuthService } from 'src/app/core/service/auth/auth.service';
import { BlogService } from 'src/app/core/service/blog/blog.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent implements OnInit {
  public digital_list = []
  public categories = []
  public products = []
  public editorValue: string = '';
  public Editor;
  min: any = 0;
  max: any = 0; 
  productPage = true
  blogForm: FormGroup;
  editProduct: any = {}
  hide = true;
  loading = false;
  files: File[] = [];
  user: any = {}
  constructor(private blogS: BlogService, private authS: AuthService,
     private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    // Dropzone.autoDiscover = false;
    this.blogForm = this.fb.group({
      blogTitle: ['', [Validators.required]],
      blogContent: ['', [Validators.required] ],
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
    this.user = this.authS.currentUser()
    this.blogContent.valueChanges.subscribe(e => console.log(e))
    const catId = this.route.snapshot.params.id
    console.log(this.user)
    // if(catId){
    //   this.blogS.(catId).subscribe((e: any) =>{
    //     console.log(e)
    //     const product = e.data
    //     this.editProduct = e.data
    //     this.productForm.patchValue({
    //       ...product
    //     })
    //   })
    // }
    
  }
  saveBlog(){
    this.loading = true
    var data = new FormData();
    data.append('upload', this.files[0]);
    this.blogS.uploadMedia(data).subscribe(e =>{
      const object = {
        blogContent: this.blogContent?.value,
        blogImage: e.images[0],
        blogTitle: this.blogTitle.value,
        blogAuthor: this.user._id
      }
      this.blogS.createBlog(object).subscribe(inv =>{
        console.log(inv)
        this.loading = false;
        this.files = []
        this.blogForm.reset()
        this.router.navigate(['dashboard/main/blog/blog-list'])
      }, err => {
        console.log(err);
        alert(err.error.message)
        this.loading = false
      })
    })
  }
  get blogTitle() {
    return this.blogForm.get('blogTitle');
  }
  get blogContent() {
    return this.blogForm.get('blogContent');
  }



}
