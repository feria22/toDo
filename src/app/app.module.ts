import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import { InMemHeroService } from './data/InMemoryDataService ';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryComponent } from './views/category/category.component';
import { TaskComponent } from './views/task/task.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import { EditTaskDialogComponent } from './dialog/edit-task-dialog/edit-task-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

const Materialize = [
  MatProgressSpinnerModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  BrowserAnimationsModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
]
@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    TaskComponent,
    EditTaskDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemHeroService,{ dataEncapsulation: false }),
    BrowserAnimationsModule,
    Materialize,
    FormsModule,

  ],
  // exports:[
  //   Materialize
  // ],
  providers: [],
  //for dynamic load
  entryComponents:[
    EditTaskDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
