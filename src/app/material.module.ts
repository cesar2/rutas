import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDividerModule} from '@angular/material/divider';
import { MatChipsModule} from '@angular/material/chips';
import { MatInputModule} from '@angular/material/input';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

const myModule = [ MatCardModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule, 
  MatFormFieldModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatChipsModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatSelectModule];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    myModule
  ],
  exports: [myModule]
})
export class MaterialModule { }
