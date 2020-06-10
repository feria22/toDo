import { Component, OnInit, Input } from '@angular/core';
import {Task} from "../../model/task";
import {LoadingService} from "../../services/loading.service";
import { of } from 'rxjs/internal/observable/of';
import {CategoryComponent} from "../category/category.component";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  tasks: Task[]
  taskForView:Task[]
  isLoading: boolean = true
  constructor(
    private load: LoadingService,

) { }

  ngOnInit(): void {
    this.load.data$.subscribe(([tasks, priorities, categories]) => {
        this.tasks = tasks
        this.taskForView = tasks
        this.isLoading = false
        // console.log( this.tasks)

      }

    )
    this.load.categoryId.subscribe(id=>
      this.filterForTask(id)
    )

  }

  filterForTask(id:number){
    console.log(id)
    id === 0 ? this.taskForView = this.tasks : this.taskForView = this.tasks.filter(x=> x.category?.id === id)
  }
}
