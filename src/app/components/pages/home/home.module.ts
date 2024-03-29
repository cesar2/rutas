import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { MaterialModule } from '../../../material.module';
import { PostComponent } from './../../../components/posts/post/post.component';


@NgModule({
  declarations: [HomeComponent,PostComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule
  ]
})
export class HomeModule { }
