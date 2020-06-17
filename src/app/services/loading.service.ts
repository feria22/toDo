import { Injectable } from '@angular/core';
import {forkJoin, Observable, Subject, of, BehaviorSubject} from "rxjs";
import {Task} from "../model/task";
import {Priority} from "../model/priority";
import {Category} from "../model/category";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  tasks: Task[]
  priorities: Priority[]
  categories: Category[]

  categoryId: Subject<number> = new Subject()
  tasks$: Subject<Task[]> = new Subject();
  priorities$: BehaviorSubject<Priority[]> = new BehaviorSubject([]);
  categories$: BehaviorSubject<Category[]>= new BehaviorSubject([]);
  constructor(
    private http:HttpService

  ) {
    this.loadingData()
  }

  loadingData(){
    let tasks$ = this.http.getAll('tasks')
    let priorities$ = this.http.getAll('priorities')
    let categories$ = this.http.getAll('categories')
    console.log('loadingData')
    forkJoin([tasks$, priorities$, categories$])
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
                else delete task.priority
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
                else delete task.category
              }
              this.tasks$.next(tasks)
              this.priorities$.next(priorities)
              this.categories$.next(categories)
      })
  }
}
