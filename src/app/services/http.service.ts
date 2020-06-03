import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private http: HttpClient ){}
  getAll(nameoFbase):Observable<any>{
    return this.http.get(`api/${nameoFbase}`)
  }
}
