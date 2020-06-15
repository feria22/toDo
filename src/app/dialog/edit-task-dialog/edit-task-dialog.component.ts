import { Component, OnInit, Inject } from '@angular/core';
import { Task } from 'src/app/model/task';
import {HttpService} from "../../services/http.service";
import { MatDialog, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent implements OnInit {

  constructor
(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,//for current dialog window
    @Inject(MAT_DIALOG_DATA) private data: [Task, string], // data from parent component for dialog window
    private http:HttpService,
    private dialog: MatDialog, //for opening new dialog window
) { }

  private dialogTitle: string;
  private task: Task;
  tmpTitle: string;


  ngOnInit() {
    this.task = this.data[0]; // task from parent
    this.dialogTitle = this.data[1]; // title from parent
    this.tmpTitle=  this.task.title;
    // console.log(this.task);
    // console.log(this.dialogTitle);

  }
  private onConfirm(): void {
    this.task.title = this.tmpTitle;
    this.dialogRef.close(this.task);

  }


  private onCancel(): void {
    this.dialogRef.close(null);
  }



}
