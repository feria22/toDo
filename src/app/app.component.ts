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
  clearTasksFilter$ = new Subject()
  statusOfTasks
  searchTitle:string=''
  searchComplete:boolean= null
  searchIdPriority:number= null
  tasksEvent= new Subject<Task[]>()

  ngOnInit(): void {
    this.load.dataMod$.subscribe(([tasks, priorities, categories])=> {
      // console.log('app subscribe',tasks)
      this.categories = categories
      this.categoriesForView=this.categories
      this.priorities = priorities
      this.tasks = tasks
      this.totalUncompleted =tasks.length-tasks.filter(task=>task.completed).length
      this.filterForTask(this.selectedCategoryId)
      }
    )
  }

  onSelectCategory($event: number) {
    this.selectedCategoryId=$event

    this.clearTasksFilter$.next(true)
    this.searchTitle=null
    this.searchComplete=null
    this.searchIdPriority =null
    this.filterForTask($event)

  }
   filterForTask(id: number) {
    if (id === null) this.taskForView = this.tasks
    else if (id === 0) this.taskForView = this.tasks.filter(task => {
      return  task.category === undefined
    })
     // console.log()
    else this.taskForView = this.tasks.filter(task => task.category?.id === id)
     let completed=this.taskForView.filter(task=>task.completed).length
     let uncompleted=this.taskForView.length-completed
     this.statusOfTasks= {'completed': completed,'uncompleted': uncompleted}
     if (this.searchTitle) {
       this.taskForView = this.taskForView.filter(task => task.title.toLowerCase().includes(this.searchTitle.toLowerCase()))
     }
     if(this.searchComplete !==null){
       this.taskForView = this.taskForView.filter(task => task.completed === this.searchComplete)
     }

     if(this.searchIdPriority !==null) {
       this.taskForView = this.taskForView.filter(task => task.priority?.id === this.searchIdPriority)
     }
     this.tasksEvent.next(this.taskForView)
  }
   filterForCategory(name?:string){
    if (name) this.categoriesForView =this.categories.filter(cat=>cat.title.toLowerCase().includes(name.toLowerCase()))
    else this.categoriesForView =this.categories
  }

  eventTask($event: [Task, string]) {
    let [task,event]=$event
    if(event==='delete') this.deleteTask(task)
    if(event==='update') this.updateTask(task)
    if(event==='add') this.addTask(task)

  }


  deleteTask (task: Task) {
    this.http.delete(task,'tasks').subscribe(()=> {
      this.tasks = this.tasks.filter(item=>item.id !== task.id)
      this.load.tasks$.next(this.tasks)
    })
    this.openSnackBar('Zadanie zostało usunięte ')
  }

  updateTask(task: Task){
    this.http.update(task,'tasks').subscribe(() =>{},
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


  searchEvent($event: [string, boolean, number]) {
    [this.searchTitle,this.searchComplete,this.searchIdPriority]=$event
    this.filterForTask(this.selectedCategoryId)
  }

  searchStatusEvent($event: boolean) {
    this.searchComplete=$event
    this.filterForTask(this.selectedCategoryId)
  }

  private addTask(task: Task) {
    this.http.add(task,'tasks').subscribe(() =>{},
      error =>  console.log(error, 'addTask')
    )
    // console.log(task)
    this.tasks.unshift(task)
    // console.log(this.tasks)
    this.load.tasks$.next(this.tasks)
    this.openSnackBar('Zadanie zostało dodane')
  }

  eventCategory($event: [Category,string]) {
    if ($event[1]==='delete'){
      this.http.delete($event[0],'categories').subscribe(
        ()=> {
          this.categories = this.categories.filter(item=>item.id !== $event[0].id)
          this.load.categories$.next(this.categories)
        })
      this.openSnackBar('Kategoria została usunięta')
    }
    if ($event[1]==='update'){
      this.http.update($event[0],'categories').subscribe(() => {
        },
        error =>  console.log(error, 'editName'))
      this.load.categories$.next(this.categories)
      this.openSnackBar('Kategoria została zmieniona')
    }
    if ($event[1]==='add'){
      this.http.add($event[0],'categories').subscribe(() =>{
          this.categories.unshift($event[0])
          this.load.categories$.next(this.categories)
          this.openSnackBar('Kategoria została dodana')

        },
        error =>  console.log(error, 'addTask')
      )
    }
  }
}
