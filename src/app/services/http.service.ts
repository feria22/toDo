import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../model/category";
import {Task} from "../model/task";
import {stringify} from "querystring";
import {map, catchError} from "rxjs/operators";
import {log} from "util";
import {LoadingService} from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    // private load:LoadingService
               ){}
  getAll(nameoFbase):Observable<any>{
    return this.http.get(`api/${nameoFbase}`)
  }
  updateTask (task: Task){
      let httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put(`api/tasks/${task.id}`, task,{
      headers: httpHeaders,
      observe: 'response'
    }).pipe(
    map(res => res.status)
  );

  }
  addTask(task){
    return this.http.post(`api/tasks/`, {...task})
  }
}

