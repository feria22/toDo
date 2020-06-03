import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../services/http.service";
import {Observable} from "rxjs";
import {Task} from "../../model/task";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.sass']
})
export class TaskComponent implements OnInit {
tasks$:Observable<Task[]>
  constructor(
    private http:HttpService
  ) { }

  ngOnInit(): void {
  this.tasks$ = this.http.getAll('tasks')
  }

}
