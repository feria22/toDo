import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../model/task";

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {
  dialogTitle:string;
  message:string;
  task:Task;
  constructor(
    private dialogRef:MatDialogRef<ConfirmDeleteComponent>,
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) private  data: [string,string]
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[0]
    this.message = this.data[1]
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
