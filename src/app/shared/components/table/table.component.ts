import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PostService } from '../../../components/posts/post.service';
import { PostI } from '../../models/post.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import Swal from 'sweetalert2';

import { ModalComponent } from './../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['titlePost', 'tagsPost', 'actions'];
  dataSource = new MatTableDataSource();


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private postSvc: PostService, public dialog: MatDialog) { }


  ngOnInit() {
    this.postSvc
      .getAllPost()
      .subscribe(posts => (this.dataSource.data = posts));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEditPost(post: PostI) {
    console.log('Edit post', post);
    this.openDialog(post);
  }

  onDeletePost(post: PostI) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `No podrás restablecer la ruta`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, borrar!'
    }).then(result => {
      if (result.value) {
        this.postSvc.deletePostById(post).then(() => {
          Swal.fire('Eliminado!', 'El post ha sido borrado.', 'success');
        }).catch((error) => {
          Swal.fire('Error!', 'Hubo un error borrando el post', 'error');
        });
      }
    }); 
  }

  onNewPost() {
    this.openDialog();
  }

  openDialog(post?: PostI): void {
    const config = {
      data: {
        message: post ? 'Editar Ruta' : 'Nueva Ruta',
        content: post
      }
    };

    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }
}