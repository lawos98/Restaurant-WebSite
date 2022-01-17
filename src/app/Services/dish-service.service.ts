import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Dish} from "../interfaces/DishInterface";
import {Observable} from "rxjs";

const baseUrl = 'http://localhost:8080/api/dishs';

@Injectable({
  providedIn: 'root'
})
export class DishServiceService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseUrl);
  }

  get(id: any): Observable<Dish> {
    return this.http.get<Dish>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${baseUrl}?title=${title}`);
  }
}
