import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../model/category";
import {Task} from "../model/task";
import {stringify} from "querystring";
import {map, catchError, tap} from "rxjs/operators";
import {log} from "util";
import {LoadingService} from "./loading.service";
import {newArray} from "@angular/compiler/src/util";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    // private load:LoadingService
  ) {
  }

  getAll(nameoFbase): Observable<any> {
    return this.http.get(`api/${nameoFbase}`)
  }

  update(obj,nameoFbase:string) {

    let httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put(`api/${nameoFbase}/${obj.id}`, {...obj}
      , {
      headers: httpHeaders,
      observe: 'response'
    }
    ).pipe(
      map(res => res.status)
    );

  }
  delete (obj,nameoFbase:string){
  let id = obj.id;
    return this.http.delete(`api/${nameoFbase}/${id}`).pipe(
      // map(res => res),
      // tap(()=> console.log('deleteTask tap',task.id))
    );
  }

  addTask(task) {
    // console.log(task)
    return this.http.post(`api/tasks/`, {...task})
  }

}
