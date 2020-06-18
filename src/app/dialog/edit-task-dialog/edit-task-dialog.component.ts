import { Component, OnInit, Inject } from '@angular/core';
import { Task } from 'src/app/model/task';
import {HttpService} from "../../services/http.service";
import { MatDialog, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import {Category} from "../../model/category";
import {Priority} from "../../model/priority";
import {LoadingService} from "../../services/loading.service";
import {Observer, Observable} from "rxjs";
import {ConfirmDeleteComponent} from "../confirm-delete/confirm-delete.component";
import {log} from "util";
import {TaskComponent} from "../../views/task/task.component";


@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent implements OnInit {
  minDate: Date;

  constructor
(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,//for current dialog window
    @Inject(MAT_DIALOG_DATA) private data: [Task, string], // data from parent component for dialog window
    private http:HttpService,
    private dialog: MatDialog, //for opening new dialog window
    private load :LoadingService,

) {
    this.minDate = new Date(Date());
  }

  dialogTitle: string;
  task: Task;
  tmpTitle: string;
  categories:Observable<Category[]>=this.load.categories$;
  priorities:Observable<Priority[]>=this.load.priorities$;
  selectedCategory: Event | Category | number
  selectedPriority: Event | Priority | number
  date: Date

  ngOnInit() {
    this.task = this.data[0]; // task from parent
    this.dialogTitle = this.data[1]; // title from parent
    this.tmpTitle=  this.task.title;
    this.date = this.task.date
    this.selectedCategory=this.task.category
    this.selectedPriority=this.task.priority
  }

 onConfirm(): void {
    this.task.title = this.tmpTitle;

    if (this.selectedCategory) {
      if (this.selectedCategory == 0)  delete  this.task.category
      else this.task.category = this.selectedCategory
      // console.log(this.selectedCategory)
    }

    if (this.selectedPriority) {
      if (this.selectedPriority==0) delete  this.task.priority
      else this.task.priority = this.selectedPriority
      // console.log(this.selectedPriority)
    }

    if(this.date) this.task.date = this.date
    else delete  this.task.date

    this.dialogRef.close(this.task);
    // console.log(this.task)

  }


 onCancel(): void {
    this.dialogRef.close(null);
  }

onDelete(){
    const dialogDelRef=this.dialog.open(
      ConfirmDeleteComponent,
      {data:['Potwierdź działanie',`Czy na pewno chcesz usunąć zadanie: " ${this.task.title} "`]}
      )
    dialogDelRef.afterClosed().subscribe(result=> {
        if (result) {
          this.dialogRef.close('delete');
        }
      })
}

}
