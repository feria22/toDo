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
  title:string
  tmpCategoryTitle:string
  category: Category

  constructor(
    private dialogRef : MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)  public data:[Category,string,number],
    private dialog:MatDialog

  ) {
  }

  ngOnInit(): void {
    let [category,title,id]=this.data
    this.title=title
    if (category !==null) {
      this.tmpCategoryTitle = category.title
      this.category = category
    }
    else{
      this.tmpCategoryTitle = ''
      this.category= new Category(id,'')
    }
  }

  onConfirm() {
    this.category.title=this.tmpCategoryTitle
    this.dialogRef.close(this.category)
  }

  onCancel() {
    this.dialogRef.close(null)
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
