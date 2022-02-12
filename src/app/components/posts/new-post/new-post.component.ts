import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostI } from '../../../shared/models/post.interface';
import { PostService } from '../post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  private image:any;
  private gpx:any;
  constructor(private postSvc: PostService) { }

  public newPostForm = new FormGroup({
    titlePost: new FormControl('', Validators.required),
    contentPost: new FormControl('', Validators.required),
    tagsPost: new FormControl('', Validators.required),
    imagePost: new FormControl('', Validators.required),
    gpxPost: new FormControl('',Validators.required)
  });

  ngOnInit(): void {
  }

  addNewPost(data: PostI){
    console.log('Adding new Post', data);
    this.postSvc.preAdAndUpdatePost(data, this.image, this.gpx);
  }

  handleImage(event:any):void{
    this.image = event.target.files;
  }

  handleGpx(event:any):void{
    this.gpx = event.target.files[0];
  }

}
