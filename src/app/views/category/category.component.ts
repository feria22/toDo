import { Component, OnInit } from '@angular/core';

import {Observable} from "rxjs";
import {Category} from "../../model/category";
import {HttpService} from "../../services/http.service";
import {log} from "util";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit {
  categories$: Observable<Category[]>

  constructor(
    private http : HttpService
  ) { }

  ngOnInit(): void {
    this.categories$ = this.http.getAll('categories')

  }

}
