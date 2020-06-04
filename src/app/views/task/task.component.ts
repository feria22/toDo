import { Component, OnInit } from '@angular/core';
import {Task} from "../../model/task";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  tasks: Task[]
  isLoading: boolean = true
  constructor(
    private load: LoadingService
  ) { }

  ngOnInit(): void {
    this.load.data$.subscribe(value => {
      this.tasks = value[0]
      this.isLoading = false
    }
  )
  }
}
