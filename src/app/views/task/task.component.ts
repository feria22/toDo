import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {Task} from "../../model/task";
import {LoadingService} from "../../services/loading.service";
import { of } from 'rxjs/internal/observable/of';
import {CategoryComponent} from "../category/category.component";
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {EditTaskDialogComponent} from "../../dialog/edit-task-dialog/edit-task-dialog.component";
import {HttpService} from "../../services/http.service";
import {BehaviorSubject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  tasks: Task[]
  tasks$ = new BehaviorSubject<Task[]>([])
  taskForView: Task[]
  isLoading: boolean = true
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  sort: MatSort
  dataSource: MatTableDataSource<Task>;
  paginatorX: number = 0;

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
      this.tasks$.next(tasks)
      // console.log(tasks)
    })
    this.load.categoryId.subscribe(id => {
      this.filterForTask(id)
    })
    this.tasks$.subscribe(tasks => {
      this.tasks = tasks
      this.taskForView = this.tasks
    })
  }

  filterForTask(id: number) {
    if (id === 0) this.taskForView = this.tasks
    else this.taskForView = this.tasks.filter(x => x.category?.id === id)
    this.refreshTable()
  }

  getPriorityColor(task: Task) {
    if (task.completed) {
      return "#6c757d"; //TODO zrobić const for color
    } else if (task.priority && task.priority.color) {
      return task.priority.color;
    } else return '#fff';//TODO zrobić const for color
  }

  private refreshTable() {
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
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Edycja zadania'], autoFocus: false});

    dialogRef.afterClosed().subscribe(result => {
      if (result=='delete') {
        this.http.deleteTask(task).subscribe(value=> {
          this.tasks = this.tasks.filter(item=>item.id !== task.id)
          console.log('delete', this.tasks)
          this.tasks$.next(this.tasks)
          this.refreshTable()
        })
        this.openSnackBar('Zadanie zostało usunięte ')
        return;
      }
      if (result as Task) {
        this.http.updateTask(result).subscribe(value =>
            console.log(value, 'editName'),
          error =>  console.log(error, 'editName')
        )
        this.openSnackBar('Zadanie zostało zmienione')
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
      duration: 100000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    })
  }
}
