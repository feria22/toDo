import { Injectable } from '@angular/core';
import {forkJoin, Observable,  BehaviorSubject, combineLatest, Subject} from "rxjs";
import {Task} from "../model/task";
import {Priority} from "../model/priority";
import {Category} from "../model/category";
import {HttpService} from "./http.service";
import {delay, map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  tasks: Task[]
  priorities: Priority[]
  categories: Category[]

  categoryId: BehaviorSubject<number> = new BehaviorSubject(null);
  tasks$: Subject<Task[]> = new Subject();
  priorities$: Subject<Priority[]> = new Subject()
  categories$: Subject<Category[]>= new Subject()

  // BehaviorSubject([]);
  constructor(
    private http:HttpService

  ) {
    this.loadingData()
  }

  loadingData(){
    let tasks$ = this.http.getAll('tasks')
    let priorities$ = this.http.getAll('priorities')
    let categories$ = this.http.getAll('categories')

    // console.log('loadingData')
    forkJoin([tasks$, priorities$, categories$])
      .pipe(
        delay(500),
        map(([tasks, priorities, categories])=>{
          tasks.map(task=>{
            categories.map(category=>{
              if((task.category === category.id)) task.category=category
            })
            priorities.map(priority=>{
              if((task.priority === priority.id)) task.priority=priority
            })
          })
          return [tasks, priorities, categories]
        })
      )
      .subscribe(( [tasks, priorities, categories] ) => {
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
