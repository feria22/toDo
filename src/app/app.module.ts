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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatOptionModule, MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ConfirmDeleteComponent } from './dialog/confirm-delete/confirm-delete.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { EditCategoryDialogComponent } from './dialog/edit-category-dialog/edit-category-dialog.component';
import { LoadingService } from './services/loading.service';
import { StatisticsComponent } from './views/statistics/statistics.component';
import { HeaderComponent } from './views/header/header.component';

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
  MatOptionModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule
]
@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    TaskComponent,
    EditTaskDialogComponent,
    ConfirmDeleteComponent,
    EditCategoryDialogComponent,
    StatisticsComponent,
    HeaderComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(InMemHeroService, {dataEncapsulation: false}),
        BrowserAnimationsModule,
        Materialize,
        FormsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
    ],
  // exports:[
  //   Materialize
  // ],
  providers: [LoadingService],
  //for dynamic load
  entryComponents:[
    EditTaskDialogComponent,
    ConfirmDeleteComponent,
    EditCategoryDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
