import { BlogService } from 'src/app/core/service/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blog: any = {}
  relatedBlogs = []
  constructor(private route: ActivatedRoute, private blogS: BlogService) { }

  ngOnInit(): void {
    this.route.params.subscribe(p =>{
      this.blogS.blogStore.subscribe(bl =>{
        this.blog = bl.filter(b => b._id === p.id)[0]
        this.relatedBlogs = bl.filter(b => b._id !== p.id)
        console.log(this.blog)
      })
    })
  }

}
