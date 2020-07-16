import {Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {Task} from "../../model/task";
import {LoadingService} from "../../services/loading.service";
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {EditTaskDialogComponent} from "../../dialog/edit-task-dialog/edit-task-dialog.component";
import {ConfirmDeleteComponent} from "../../dialog/confirm-delete/confirm-delete.component";
import {Priority} from "../../model/priority";
import {Observable} from "rxjs";


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  tasks: Task[]
  // @Input('tasks')
  // set setTasks(tasks: Task[]){
  //   console.log('set in task',tasks)
  //   if (!tasks) return;
  //   this.tasks=tasks
  //   if(tasks) this.isLoading = false
  //   this.refreshTable()
  //
  // }
  @Input () tasks$
  @Input () priorities:Priority[]
  @Output() selectCategory = new EventEmitter<number>()
  @Output() taskEvent = new EventEmitter<[Task,string]>()
  @Output() searchTask = new EventEmitter<[string?,boolean?,number?]>()
  @Input() clearTasksFilter$ :Observable<boolean>
  @Input ('searchComplete')
  set  setSearchComplete (item){
      switch (item){
        case true: {
          this.searchComplete = '1';
          break
        }
        case false : {
          this.searchComplete = '0';
          break
        }

      }
  }
  isLoading: boolean = true
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category','delete','update','toggle'];
  sort: MatSort
  dataSource: MatTableDataSource<Task>;
  paginatorX: number = 0;
  searchTitle:string=''
  searchComplete:string
  searchPriority:string

  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;

  // because we have a structural directive
  @ViewChild(MatSort, {static: false})
  set MatSort(sort: MatSort | null) {
    if (!sort) return;
    this.sort = sort;
    this.addTableObj()
  }

  constructor(
    private load: LoadingService,
    private dialog: MatDialog,

  ) {
  }

  ngOnInit(): void {
    this.tasks$.subscribe((tasks)=>{
      this.tasks=tasks
      if(tasks) this.isLoading = false
        this.refreshTable()
    })
    this.dataSource = new MatTableDataSource()
    this.refreshTable()
    this.clearTasksFilter$.subscribe(()=>{
      this.clearTasksFilterFunction()
    })
  }

  clearTasksFilterFunction(){
    this.searchTitle =null
    this.searchComplete =null
    this.searchPriority =null
    this.searchTask.emit([null,null,null])
  }
  getPriorityColor(task: Task) {
    if (task.completed) {
      return "#6c757d"; //TODO zrobić const for color
    } else if (task.priority && task.priority.color) {
      return task.priority.color;
    } else return '#fff';//TODO zrobić const for color
  }

  private refreshTable() {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks;
    this.addTableObj();
    this.dataSource.sortingDataAccessor = (item, colName) => {
      switch (colName) {
        case 'title': {
          return item.title
        }
        case 'date': {
          return item.date ? item.date : null
        }
        case 'priority': {
          return item.priority ? item.priority.id : null;
        }
        case 'category': {
          return item.category ? item.category.title : null;
        }
        case 'toggle':{
          return item.completed
        }
      }
    }
  }

  private addTableObj() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  onEdit(task: Task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Edycja zadania'],
      autoFocus: false,
      minWidth:"500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result=='delete') {
        this.taskEvent.emit([task,'delete'])
        return;
      }
      if (result as Task) {
        this.taskEvent.emit([task,'update'])
        return;
      }
    });
  }

  pageEvent($event: PageEvent) {
    // console.log($event)
    this.paginatorX = $event.pageIndex * $event.pageSize
  }


  onDelete(task: Task) {
    const dialogRef=this.dialog.open(ConfirmDeleteComponent,
      {
        data:[
          'Potwierdź działanie',
          `Czy na pewno chcesz usunąć zadanie: " ${task.title} "`
        ],
      });
    dialogRef.afterClosed().subscribe(result=> {
        if (result) this.taskEvent.emit([task,'delete'])
      })
  }

  onComplete(task: Task) {
    task.completed=!task.completed;
    this.taskEvent.emit([task,'update'])
  }

  onCategory(id?: number) {
   if (id) this.selectCategory.emit(id)
   else this.selectCategory.emit(0)

  }

  onFilter() {
    let searchCompleteTypeFix:boolean
    if (this.searchComplete === '1') searchCompleteTypeFix=true
    else  if (this.searchComplete === '0') searchCompleteTypeFix=false
    else searchCompleteTypeFix=null
    let searchPriorityFix : number = this.searchPriority ? +this.searchPriority : null
  this.searchTask.emit([this.searchTitle,searchCompleteTypeFix,searchPriorityFix])

  }

  onAddTask() {
    let newId=Math.max(...this.tasks.map(t=>t.id))+1
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [null, 'Dodaj zadanie',newId],
      autoFocus: false,
      minWidth:"500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result as Task) {
        this.selectCategory.next(null)
        this.taskEvent.emit([result,'add'])
      }
    });
  }
}

