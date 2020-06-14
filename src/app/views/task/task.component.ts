import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {Task} from "../../model/task";
import {LoadingService} from "../../services/loading.service";
import { of } from 'rxjs/internal/observable/of';
import {CategoryComponent} from "../category/category.component";
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit{

  tasks: Task[]
  taskForView:Task[]
  isLoading: boolean = true
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  sort:  MatSort
  dataSource: MatTableDataSource<Task>;
  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;
  // because we have a structural directive
  @ViewChild(MatSort, {static: false})
  set MatSort(sort : MatSort|null) {
    if(!sort) return;
    this.sort = sort ;
    this.addTableObj()
  }

  // private sort: MatSort;
  constructor(
    private load: LoadingService,

) { }



  ngOnInit(): void {
    this.load.data$.subscribe(([tasks, priorities, categories]) => {
        this.dataSource = new MatTableDataSource(tasks)
        this.tasks = tasks
        this.taskForView = this.tasks
        this.isLoading = false
      })
    this.load.categoryId.subscribe(id=> {
        this.filterForTask(id)
      })
  }

  filterForTask(id:number){
    if(id===0) this.taskForView = this.tasks
    else this.taskForView = this.tasks.filter(x => x.category.id === id)
    this.refreshTable()
  }

  getPriorityColor(task: Task) {
    if(task.completed){
      return "#6c757d"; //TODO zrobić const for color
    }
    else if(task.priority && task.priority.color) {
      return task.priority.color;
    }
    else return '#fff';//TODO zrobić const for color
  }

  private refreshTable() {
    this.dataSource.data = this.taskForView;
    this.addTableObj();
  }

  private addTableObj() {
    this.dataSource.sort =  this.sort;
    this.dataSource.paginator = this.paginator

    this.dataSource.sortingDataAccessor=(task:Task,colName)=>{
      switch (colName) {
        case 'title': {
          return task.title
        }
        case 'date': {
          return task.date ? task.date : null
        }
        case 'priority': {
          return task.priority ? task.priority.id : null;
        }
        case 'category': {
          return task.category ? task.category.title : null;
        }
      }
    }

  }
}
