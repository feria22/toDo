import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Category} from "../../model/category";
import {LoadingService} from "../../services/loading.service";
import {TaskComponent} from "../task/task.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit {


  categories: Category[]
  selectedCategory: Category
  // activeId:number
  constructor(
    private load: LoadingService,
    // private tasks: TaskComponent
  ) { }

  ngOnInit(): void {
    this.load.data$.subscribe(([tasks, priorities, categories]) => {
        this.categories = categories
      }
    )
  }

  onCategoryClick(category?:Category) {
    if (category !== undefined) {
      this.selectedCategory = category
      this.load.categoryId.next(category.id)
    }
    else this.load.categoryId.next(0)
  }
}
