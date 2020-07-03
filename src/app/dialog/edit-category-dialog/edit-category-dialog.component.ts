import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Category} from "../../model/category";
import {ConfirmDeleteComponent} from "../confirm-delete/confirm-delete.component";

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.scss']
})
export class EditCategoryDialogComponent implements OnInit {
  title:string;
  tmpCategoryTitle:string;
  category: Category
  constructor(
    private dialogRef : MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data:Category,
    private dialog:MatDialog

  ) {
  }

  ngOnInit(): void {
    this.title = "Edycja kategorii"
    this.tmpCategoryTitle = this.data.title
    this.category = this.data
  }

  onConfirm() {
    this.category.title=this.tmpCategoryTitle
    this.dialogRef.close(this.category)
    console.log(this.tmpCategoryTitle,'ok')
  }

  onCancel() {
    this.dialogRef.close('cancel')
  }

  onDelete(category:Category) {
    const  dialogRef=this.dialog.open(ConfirmDeleteComponent,
      {
        data:[
          'Potwierdź działanie',
          `Czy na pewno chcesz usunąć zadanie: " ${category.title} "`
        ],
      });
    dialogRef.afterClosed().subscribe(result=> {
      if (result) {
        this.dialogRef.close('delete');
      }
    } )

  }
}
