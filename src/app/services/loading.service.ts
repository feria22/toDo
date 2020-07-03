import { Injectable } from '@angular/core';
import {forkJoin, Observable, BehaviorSubject, combineLatest, Subject, AsyncSubject, of, from, interval} from "rxjs";
import {Task} from "../model/task";
import {Priority} from "../model/priority";
import {Category} from "../model/category";
import {HttpService} from "./http.service";
import {delay, map, tap, delayWhen, take, skipUntil, startWith, skip, share, withLatestFrom, debounce} from "rxjs/operators";
import {log} from "util";


@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  tasks: Task[]
  priorities: Priority[]
  categories: Category[]
  tasks$: Subject<Task[]> = new  Subject()
  priorities$:  BehaviorSubject <Priority[]> = new  BehaviorSubject([ ])
  categories$:  BehaviorSubject<Category[]>= new  BehaviorSubject([ ])

  constructor(
    private http:HttpService
  ) {
   this.loadingData$.subscribe(( [tasks, priorities, categories] ) => {
     this.tasks$.next(tasks)
     this.priorities$.next(priorities)
     this.categories$.next(categories)

   })
  }

  loadingData$=forkJoin([this.http.getAll('tasks'), this.http.getAll('priorities'), this.http.getAll('categories')])
      .pipe(take(1),)


  dataMod$: Observable<[Task[],Priority[],Category[]]> = combineLatest <Subject<Task[]>, BehaviorSubject<Priority[]>, BehaviorSubject<Category[]>> ([this.tasks$,this.priorities$,this.categories$])
    .pipe(
    skip(2),
      map(([tasks, priorities, categories])=>{
        categories.map(category=>category.uncompleted=0)
        let categoriesId=categories.map(cat=> cat.id)
        tasks.map(task=>{
          categories.map(category=>{
            if(task.category === category.id) task.category=category
            if ((task.category?.id === category.id) && (!task.completed)) {
              category.uncompleted++
              }
          })
          if (categoriesId.filter(id=>id===task.category?.id).length === 0) {
            delete task.category
          }
          priorities.map(priority=>{
            if((task.priority === priority.id)) task.priority=priority
            })
          })
        return [tasks, priorities, categories ]
      }),

    )





}
