import { Injectable } from '@angular/core';
import {forkJoin, Observable, Subject} from "rxjs";
import {Task} from "../model/task";
import {Priority} from "../model/priority";
import {Category} from "../model/category";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  tasks$: Observable<Task[]> = this.http.getAll('tasks')
  tasks: Task[]
  priorities$: Observable<Priority[]> = this.http.getAll('priorities')
  priorities: Priority[]
  categories$: Observable<Category[]> = this.http.getAll('categories')
  categories: Category[]
  isLoading: boolean = true
  data$= new Subject();
  public categoryId:Subject<number>= new Subject()
  constructor(
    private http:HttpService

  ) {
    forkJoin< Task[], Priority[], Category[]>(
      this.tasks$,
      this.priorities$,
      this.categories$)
      .subscribe(( [tasks, priorities, categories] ) => {
        for(let task of tasks ) {
          if (task.priority) {
            for (let priority of priorities) {
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
            for (let category of categories) {
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
        this.tasks = tasks
        this.isLoading=false
        console.log('loading')
        this.data$.next([tasks, priorities, categories])
      })

  }


}
