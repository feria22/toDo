import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Category} from "../../model/category";
import {LoadingService} from "../../services/loading.service";
import {MatDialog} from "@angular/material/dialog";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {HttpService} from "../../services/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories:Category[]
  selectedCategoryId: number = null
  indexMouseMove:number
  totalUncompleted:number

  constructor(
    private load: LoadingService,
    private dialog: MatDialog,
    private http: HttpService,
    private matSnack:MatSnackBar
  ) { }

  ngOnInit(): void {
  this.load.categoryMod$.subscribe(value=> {
    this.categories = value
    this.totalUncompleted=value.reduce((sum,item)=> {
      return sum + item.uncompleted
    },0)
  })

    this.load.categoryId.subscribe(id=>{
      if(id&&(id!==0)) this.selectedCategoryId = id
      else if (id===0) this.selectedCategoryId = 0
      else this.selectedCategoryId=null
    })

  }

  onCategoryClick(category?:Category) {
    if (category !== undefined) {
      this.load.categoryId.next(category.id)
    }
    else this.load.categoryId.next(null)
    // console.log('onCategoryClick',category)
  }

  showEditIcon(index:number) {
    this.indexMouseMove = index
    // console.log(index)
  }

  onEdit(category: Category) {
    const dialogRef=this.dialog.open(EditCategoryDialogComponent, {data: category,
    width:'500px',
    disableClose:true});

    dialogRef.afterClosed().subscribe(result=> {
      if (result=='delete') {
          this.http.delete(category,'categories').subscribe(
            value=> {
              this.categories = this.categories.filter(item=>item.id !== category.id)
              this.load.categories$.next(this.categories)
              console.log('delete this.load.categories$.next')
              return;
            })
      }
      if(result as Category){
        // console.log(result )
        this.http.update(result,'categories').subscribe(value =>
          // console.log(value, 'editName'),
          error =>  console.log(error, 'editName')
        )
        this.openSnackBar('Zadanie zostało zmienione')
        return;
      }
      console.log('closed')
    } )
  }

  openSnackBar(message:string){
    this.matSnack.open(message,' ',{
      duration: 800,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    })
  }
}
