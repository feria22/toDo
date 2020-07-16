import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Category} from "../../model/category";
import {LoadingService} from "../../services/loading.service";
import {MatDialog} from "@angular/material/dialog";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";




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
      if(result === null)  return
      if (result ==='delete') {
        this.eventCategory.next([category,'delete'])
        return
      }
      else if (result as Category){
        this.eventCategory.next([category,'update'])
      }
    } )
  }


  onFilter() {
      this.categoryFilter.emit(this.searchCategory)
  }

  addCategory() {
    let newId=Math.max(...this.categories.map(t=>t.id))+1
    const dialogRef=this.dialog.open(EditCategoryDialogComponent, {data: [null,"Dodaj kategorie",newId],
      width:'500px',
      disableClose:true});
    dialogRef.afterClosed().subscribe(result=> {
      if(result === null)  return
      if (result as Category){
        this.eventCategory.next([result,'add'])
      }
    } )
  }

  sorting(type: string) {
    let x:number
    if (type!=='max') {
      type === 'az'? x = 1 : x = -1
      this.categories.sort((a, b) => {
        let c=a.title.toLowerCase()
        let d=b.title.toLowerCase()
        if (c > d)
          return x
        else if (c < d) {
          return -x
        } else return 0
      })
    }
    else {
      this.categories.sort((a, b) => {
        if (a.uncompleted < b.uncompleted)
          return 1
        else if (a.uncompleted > b.uncompleted) {
          return -1
        } else return 0
      })
    }
  }
}
