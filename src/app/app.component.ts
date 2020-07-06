import {Component, OnInit} from '@angular/core';
import {HttpService} from "./services/http.service";
import {LoadingService} from "./services/loading.service";
import {Category} from "./model/category";
import {Priority} from "./model/priority";
import {Task} from "./model/task";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private http:HttpService,
    private load:LoadingService,
    private matSnack:MatSnackBar
  ) {

  }
  title = 'toDo';
  selectedCategoryId : number=null
  categories : Category[]
  priorities : Priority[]
  tasks : Task []
  taskForView: Task[]
  totalUncompleted : number
  categoriesForView:Category[]
  clearTasksFilter = new Subject()
  ngOnInit(): void {
    this.load.dataMod$.subscribe(([tasks, priorities, categories])=> {
      this.categories = categories
      this.categoriesForView=this.categories
      this.priorities = priorities
      this.tasks = tasks
      this.totalUncompleted = this.categories.reduce((sum,item)=> {
            return sum + item.uncompleted
          },0)
      this.filterForTaskByCategory(this.selectedCategoryId)
      }
    )
  }

  onSelectCategory($event: number) {
    this.selectedCategoryId=$event
    this.filterForTaskByCategory($event)
    this.clearTasksFilter.next(true)
  }
   filterForTaskByCategory(id: number) {
    if (id === null) this.taskForView = this.tasks
    else if (id === 0) this.taskForView = this.tasks.filter(x => {
      return  x.category === undefined
    })
    else this.taskForView = this.tasks.filter(x => x.category?.id === id)

  }
   filterForCategory(name?:string){
    if (name) this.categoriesForView =this.categories.filter(cat=>cat.title.toLowerCase().includes(name.toLowerCase()))
    else this.categoriesForView =this.categories
  }

  eventTask($event: [Task, string]) {
    let [task,event]=$event
    if(event==='delete') this.deleteTask(task)
    if(event==='update') this.updateTask(task)

  }


  deleteTask (task: Task) {
    this.http.delete(task,'tasks').subscribe(()=> {
      this.tasks = this.tasks.filter(item=>item.id !== task.id)
      this.load.tasks$.next(this.tasks)
    })
    this.openSnackBar('Zadanie zostało usunięte ')
  }

  updateTask(task: Task){
    this.http.update(task,'tasks').subscribe(() =>
      error =>  console.log(error, 'editName')
    )
    this.load.tasks$.next(this.tasks)
    this.openSnackBar('Zadanie zostało zmienione')
  }
  openSnackBar(message:string){
    this.matSnack.open(message,' ',{
      duration: 800,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    })
  }


  filterForTask($event: [string, boolean, number]) {

    let [title,completed,idPriority]=$event
    this.filterForTaskByCategory(this.selectedCategoryId)

   if (title.length>0) {
     this.taskForView = this.taskForView.filter(task => task.title.toLowerCase().includes(title.toLowerCase()))
   }
    if(completed !==null){
      this.taskForView = this.taskForView.filter(task => task.completed === completed)
    }

    if(idPriority !==null) {
      this.taskForView = this.taskForView.filter(task => task.priority?.id === idPriority)
    }

  }
}
