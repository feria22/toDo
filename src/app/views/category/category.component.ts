import { Component, OnInit } from '@angular/core';
import {Category} from "../../model/category";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit {
  categories: Category[]

  constructor(
    private load: LoadingService
  ) { }

  ngOnInit(): void {
    this.load.data$.subscribe(value => {
        this.categories = value[2]
      }
    )
  }

}
