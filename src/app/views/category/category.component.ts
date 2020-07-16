import {Component, OnInit, Output, EventEmitter, Input, AfterViewInit, AfterViewChecked, OnChanges} from '@angular/core';
import {Category} from "../../model/category";
import {LoadingService} from "../../services/loading.service";
import {MatDialog} from "@angular/material/dialog";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {HttpService} from "../../services/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {log} from "util";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @Input()  categories : Category[];
  @Input()  selectedCategoryId:number
  @Output() selectCategory = new EventEmitter<number>()
  @Input()   totalUncompleted:number
  @Output() categoryFilter = new EventEmitter<string>()
  indexMouseMove:number
  searchCategory:string =''
  @Output() eventCategory=new EventEmitter<[Category,string]>()

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
    const dialogRef=this.dialog.open(EditCategoryDialogComponent, {data: [category,"Edycja kategorii"],
    width:'500px',
    disableClose:true});

    dialogRef.afterClosed().subscribe(result=> {
      if (result ==='delete') {
        this.eventCategory.next([category,'delete'])
          // this.http.delete(category,'categories').subscribe(
          //   value=> {
          //     this.categories = this.categories.filter(item=>item.id !== category.id)
          //     this.load.categories$.next(this.categories)
          //     return;
          //   })
      }
      else if (result as Category){

        // this.http.update(result,'categories').subscribe(value => {
        //   },
        //   error =>  console.log(error, 'editName')
        this.eventCategory.next([category,'update'])
        // )
        // this.openSnackBar('Zadanie zostało zmienione')
        // this.load.categories$.next(this.categories)
        // return;
      }
    } )
  }


  onFilter() {
      this.categoryFilter.emit(this.searchCategory)
      // console.log('emit',this.searchCategory)
  }

  addCategory() {
    let newId=Math.max(...this.categories.map(t=>t.id))+1
    const dialogRef=this.dialog.open(EditCategoryDialogComponent, {data: [null,"Dodaj kategorie",newId],
      width:'500px',
      disableClose:true});
    dialogRef.afterClosed().subscribe(result=> {
      if (result as Category){
        this.eventCategory.next([result,'add'])
        // console.log('  addCategory',result)
      }
    } )
  }
}
