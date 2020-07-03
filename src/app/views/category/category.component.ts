import {Component, OnInit, Output, EventEmitter, Input, AfterViewInit, AfterViewChecked, OnChanges} from '@angular/core';
import {Category} from "../../model/category";
import {LoadingService} from "../../services/loading.service";
import {MatDialog} from "@angular/material/dialog";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {HttpService} from "../../services/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {log} from "util";


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @Input()  categories : Category[];
  @Input()  selectedCategoryId:number
  @Output() selectCategory= new EventEmitter<number>()
  @Input()   totalUncompleted:number
  indexMouseMove:number




  constructor(
    private load: LoadingService,
    private dialog: MatDialog,
    private http: HttpService,
    private matSnack:MatSnackBar
  ) { }


  ngOnInit(): void {

  }

  onCategoryClick(category?:Category) {
    if (category !== undefined) {
      this.selectedCategoryId=category.id
    }
    else this.selectedCategoryId=null
    this.selectCategory.next(this.selectedCategoryId)
  }

  showEditIcon(index:number) {
    this.indexMouseMove = index

  }

  onEdit(category: Category) {
    const dialogRef=this.dialog.open(EditCategoryDialogComponent, {data: category,
    width:'500px',
    disableClose:true});

    dialogRef.afterClosed().subscribe(result=> {
      if (result ==='delete') {
          this.http.delete(category,'categories').subscribe(
            value=> {
              this.categories = this.categories.filter(item=>item.id !== category.id)
              this.load.categories$.next(this.categories)
              return;
            })
      }
      else if (result as Category){

        this.http.update(result,'categories').subscribe(value => {
          },
          error =>  console.log(error, 'editName')

        )
        this.openSnackBar('Zadanie zostało zmienione')
        this.load.categories$.next(this.categories)
        return;
      }
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
