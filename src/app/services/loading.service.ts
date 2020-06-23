import { Injectable, EventEmitter } from '@angular/core';
import {forkJoin, Observable, Subject, of, BehaviorSubject, combineLatest} from "rxjs";
import {Task} from "../model/task";
import {Priority} from "../model/priority";
import {Category} from "../model/category";
import {HttpService} from "./http.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  tasks: Task[]
  priorities: Priority[]
  categories: Category[]
  categoryId: BehaviorSubject<number> = new BehaviorSubject(null);
  tasks$: BehaviorSubject<Task[]> = new BehaviorSubject([]);
  userTasks$ :BehaviorSubject<Task[]>= new BehaviorSubject([]);
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

  categoryMod$: Observable<Category[]> =  combineLatest <Observable<Category>,Observable<Task>> ([this.categories$,this.tasks$])
      .pipe(
          map((value)=> {
            let result = value[0].map(item => {
                let {id, title} = item
                let {uncompleted} = value[1].reduce((count, data) => {
                  if ((data.category?.id === id) && (!data.completed)) {
                    count.uncompleted++
                  }
                  return count
                }, {uncompleted: 0})
                return {id, title, uncompleted}
              })
            return result
          })
      )

}
