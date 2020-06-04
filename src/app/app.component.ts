import {Component, OnInit} from '@angular/core';
import {HttpService} from "./services/http.service";
import {log} from "util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private http:HttpService
  ) {
  }
  title = 'toDo';

  ngOnInit(): void {

  }

}
