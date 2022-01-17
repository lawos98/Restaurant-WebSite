import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Dish} from "../interfaces/DishInterface";
import {GlobalData} from "../interfaces/GlobalDataInterface";

const baseUrl = 'http://localhost:8080/api/globaldata';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<GlobalData[]> {
    return this.http.get<GlobalData[]>(baseUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

}
