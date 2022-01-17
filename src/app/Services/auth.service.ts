import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interfaces/UserInterface";

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({
    'X-Powered-By': 'Express',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'x-access-token, Origin, Content-Type, Accept',
    'Content-Type':'application/json; charset=utf-8',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }
  update(data: any):Observable<any>{
    return this.http.put('http://localhost:8080/api/auth/user',data,httpOptions);
  }
  getAll():Observable<User[]>{
    return this.http.get<User[]>(`${AUTH_API}users`)
  }
}
