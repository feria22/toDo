import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Category} from "../../model/category";
import {LoadingService} from "../../services/loading.service";
import {TaskComponent} from "../task/task.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {


  categories: Category[]
  selectedCategoryId: number = null
  constructor(
    private load: LoadingService,
    // private tasks: TaskComponent
  ) { }

  ngOnInit(): void {
    this.load.categories$.subscribe((categories) => {
        this.categories = categories
      }
    )
    this.load.categoryId.subscribe(id=>{
      // console.log('categoryId.subscribe',id)
      if(id&&(id!==0)) this.selectedCategoryId = id
      else if (id===0) this.selectedCategoryId=0
      else this.selectedCategoryId=null
    })
    // console.log('ngOnInit', this.selectedCategoryId)
  }

  onCategoryClick(category?:Category) {
    if (category !== undefined) {
      this.load.categoryId.next(category.id)
    }
    else this.load.categoryId.next(null)
    // console.log('onCategoryClick',category)
  }
}
