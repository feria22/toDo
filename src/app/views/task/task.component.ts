import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {Task} from "../../model/task";
import {LoadingService} from "../../services/loading.service";
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {EditTaskDialogComponent} from "../../dialog/edit-task-dialog/edit-task-dialog.component";
import {HttpService} from "../../services/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDeleteComponent} from "../../dialog/confirm-delete/confirm-delete.component";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  tasks: Task[]
  // tasks$ = new Subject<Task[]>()
  taskForView: Task[]
  isLoading: boolean = true
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category','delete','update','toggle'];
  sort: MatSort
  dataSource: MatTableDataSource<Task>;
  paginatorX: number = 0;
  selectedCategoryId: number = null

  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;

  // because we have a structural directive
  @ViewChild(MatSort, {static: false})
  set MatSort(sort: MatSort | null) {
    if (!sort) return;
    this.sort = sort;
    this.addTableObj()
  }

  // private sort: MatSort;
  constructor(
    private load: LoadingService,
    private dialog: MatDialog,
    private http: HttpService,
    private matSnack:MatSnackBar
  ) {
  }


  ngOnInit(): void {
    this.load.tasks$.subscribe((tasks) => {
      this.dataSource = new MatTableDataSource(tasks)
      this.isLoading = false
      this.tasks= tasks
      this.load.userTasks$.next(tasks)
      // console.log(' ngOnInit load.tasks$', tasks)
    })
    this.load.categoryId.subscribe(id => {
      this.selectedCategoryId=id
      // console.log('ngOnInit  categoryId.subscribe tasks',id)
      this.onFilterForTask(this.selectedCategoryId)
    })
    this.load.userTasks$.subscribe(tasks => {
      this.tasks=tasks;
      this.filterForTask(this.selectedCategoryId)
      // console.log('ngOnInit  tasks$.subscribe', this.tasks)

    })
    // console.log(this.tasks,this.taskForView)
  }
  onFilterForTask(id?: number){
    this.filterForTask(id)
    // this.tasks$.next(this.taskForView)
  }

  filterForTask(id?: number) {
    // console.log('filterForTask',id)
    if (id === null) this.taskForView = this.tasks
    else if (id === 0) this.taskForView = this.tasks.filter(x => {
      return  x.category === undefined
    })
    else this.taskForView = this.tasks.filter(x => x.category?.id === id)
    // this.tasks$.next(this.taskForView)
    if(this.tasks.length) this.refreshTable()
  }

  getPriorityColor(task: Task) {
    if (task.completed) {
      return "#6c757d"; //TODO zrobić const for color
    } else if (task.priority && task.priority.color) {
      return task.priority.color;
    } else return '#fff';//TODO zrobić const for color
  }

  private refreshTable() {
    // console.log('refreshTable', this.dataSource.data)
    this.dataSource.data = this.taskForView;
    this.addTableObj();
  }

  private addTableObj() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
    // console.log( this.dataSource)
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
      }
    }
  }

  editName(task: Task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Edycja zadania'],
      autoFocus: false,
      minWidth:"500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result=='delete') {
        this.deleteTask(task)
        return;
      }
      if (result as Task) {
        this.updateTask(result)
        return;
      }
    });
  }

  pageEvent($event: PageEvent) {
    // console.log($event)
    this.paginatorX = $event.pageIndex * $event.pageSize
  }
  openSnackBar(message:string){
    this.matSnack.open(message,' ',{
      duration: 800,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    })
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
        if (result) this.deleteTask(task)
      })
  }

   deleteTask (task: Task) {
    this.http.delete(task,'tasks').subscribe(value=> {
      this.tasks = this.tasks.filter(item=>item.id !== task.id)

      console.log('delete this.load.userTasks$.next', this.tasks)
      this.load.userTasks$.next(this.tasks)
      this.load.tasks$.next(this.tasks)

      // this.refreshTable()
      // console.log('deleteTask 1', this.tasks,this.taskForView)

    })
    this.openSnackBar('Zadanie zostało usunięte ')
     // console.log('deleteTask 2', this.tasks,this.taskForView)
  }
  updateTask(task: Task){
    this.http.update(task,'tasks').subscribe(value =>
        // console.log(value, 'editName'),
      error =>  console.log(error, 'editName')
    )
    this.openSnackBar('Zadanie zostało zmienione')
  }
  onComplete(task: Task) {
    task.completed=!task.completed;
    this.updateTask(task)
  }

  onCategory(id?: number) {
   if (id) this.load.categoryId.next(id)
   else this.load.categoryId.next(0)
  }
}

