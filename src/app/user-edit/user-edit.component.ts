import { Component, OnInit } from '@angular/core';
import {User} from "../interfaces/UserInterface";
import {DishServiceService} from "../Services/dish-service.service";
import {AuthService} from "../Services/auth.service";
import {GlobalDataService} from "../Services/global-data.service";
import {GlobalData} from "../interfaces/GlobalDataInterface";
import {TokenStorageService} from "../Services/token-storage.service";
import {slideLeft} from "../animation/animation";
import firebase from "firebase/compat";
import Persistence = firebase.auth.Auth.Persistence;
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  animations:[slideLeft]
})
export class UserEditComponent implements OnInit {
  UserList:User[]=[]
  Persistence:GlobalData={
    title:'Persistence',
    value:0,
  }

  constructor(
    private dishService: DishServiceService,
    private authService:AuthService,
    private globalDataService:GlobalDataService,
    private tokenStorageService:TokenStorageService,
    private router:Router) {}

  ngOnInit(): void {
    this.retrieveTutorials();
    this.getGlobalData()
  }
  returnClass(val:number){
    if(this.Persistence.value==val)return'buttonActiveP'
    return ''
  }

  retrieveTutorials(): void {
    this.authService.getAll()
      .subscribe({
        next: (data) => {
          this.UserList = data;
        },
        error: (e) => console.error(e)
      });
  }
  refreshList(): void {
    this.retrieveTutorials();
  }
  giveRole(user:User,role:string){
    let temp=user
    temp.roles.push(role)
    this.authService.update(temp).subscribe()
  }
  takeRole(user:User,role:string){
    let temp=user
    temp.roles=temp.roles.filter(x=>x!=role)
    this.authService.update(temp).subscribe()
  }
  checkRole(user:User,role:string){
    return user.roles.includes(role)
  }
  updateGlobalData(v:number){
    this.globalDataService.getAll().subscribe({
      next: (data) => {
        // @ts-ignore
        this.Persistence=data.find(x=> x.title='Persistence')
        this.Persistence.value=v
        this.globalDataService.update(this.Persistence.id,this.Persistence).subscribe()
        window.sessionStorage.clear()
        window.localStorage.clear()
        window.location.reload();
      },
      error: (e) => console.error(e)
    });
  }
  getGlobalData(){
    this.globalDataService.getAll().subscribe({
      next: (data) => {
        // @ts-ignore
        this.Persistence=data.find(x=> x.title='Persistence')
      },
      error: (e) => console.error(e)
    });
  }
}
