import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../services/http.service";
import {Observable, of, forkJoin} from "rxjs";
import {Task} from "../../model/task";

import {Priority} from "../../model/priority";
import {Category} from "../../model/category";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  tasks$: Observable<Task[]> = this.http.getAll('tasks')
  tasks: Task[]
  priorities$: Observable<Priority[]> = this.http.getAll('priorities')
  priorities: Priority[]
  categories$: Observable<Category[]> = this.http.getAll('categories')
  categories: Category[]
  isLoading: boolean = true
  constructor(
    private http:HttpService
  ) { }

  ngOnInit(): void {

   forkJoin< Task[], Priority[], Category[]>(
     this.tasks$,
     this.priorities$,
     this.categories$)
      .subscribe((value) => {
        for(let task of value[0] ) {
          if (task.priority) {
            for (let priority of value[1]) {
              switch (task.priority) {
                case priority.id: {
                  task.priority = priority
                  break
                }
              }
            }
          }
          else task.priority=''
          if (task.category) {
            for (let category of value[2]) {
              switch (task.category) {
                case category.id: {
                  task.category = category
                  break
                }
              }
            }
          }
          else task.category=''
        }
        this.tasks = value[0]
        this.isLoading=false
   })

}
}
