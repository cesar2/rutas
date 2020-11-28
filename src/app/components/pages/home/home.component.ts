import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PostI } from '../../../shared/models/post.interface';
import { PostService } from './../../posts/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public posts$: Observable<PostI[]>;
  public posts_all$: Observable<PostI[]>;
  constructor(private postSvc: PostService){

  }

  ngOnInit(){
    this.posts$ = this.postSvc.getAllPost();
    this.posts_all$ = this.postSvc.getAllPost();
  }

  applyFilter(event: any) {
    var fil =  event.target.value.trim().toLowerCase();
    if(fil == "")
    {
      this.posts$ = this.posts_all$;
    }
    else
    {
      this.posts$ = this.posts$.pipe(map(posts => posts.filter(post => post.titlePost.trim().toLowerCase().includes(fil))));
    }
    
  }
 
}
