import { Component, OnInit, Inject } from '@angular/core';
import { Task } from 'src/app/model/task';
import {HttpService} from "../../services/http.service";
import { MatDialog, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import {Category} from "../../model/category";
import {Priority} from "../../model/priority";
import {LoadingService} from "../../services/loading.service";
import { Observable} from "rxjs";
import {ConfirmDeleteComponent} from "../confirm-delete/confirm-delete.component";



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
    @Inject(MAT_DIALOG_DATA)  public data: [Task, string,number], // data from parent component for dialog window
    private http:HttpService,
    private dialog: MatDialog, //for opening new dialog window
    private load :LoadingService,

) {
    this.minDate = new Date(Date());
  }

  dialogTitle: string;
  task: Task;
  tmpTitle: string;
  tmpCompleted: boolean;
  categories:Observable<Category[]>=this.load.categories$;
  priorities:Observable<Priority[]>=this.load.priorities$;
  selectedCategory: Event | Category | number
  selectedPriority: Event | Priority | number
  date: Date

  ngOnInit() {
    if(this.data[0]) {
      this.task = this.data[0]; // task from parent
    }
    else {
      // let test = new Task(this.data[2],'',false)
      this.task = new Task(this.data[2],'',false)

    }
    // console.log(this.task)
      this.dialogTitle = this.data[1]; // title from parent
      this.tmpTitle = this.task.title;
      this.tmpCompleted = this.task.completed
      this.date = this.task.date
      this.selectedCategory = this.task.category
      this.selectedPriority = this.task.priority

    // console.log(this.task)
  }

 onConfirm(): void {
    this.task.title = this.tmpTitle;
    this.task.completed=this.tmpCompleted;
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


  onToggle(task: Task) {
    this.tmpCompleted=!this.tmpCompleted
  }
}
