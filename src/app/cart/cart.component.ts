import { Component, OnInit } from '@angular/core';
import {Dish} from "../interfaces/DishInterface";
import {filterInfo} from "../interfaces/FilterInterface";
import {DishServiceService} from "../Services/dish-service.service";
import {AuthService} from "../Services/auth.service";
import {TokenStorageService} from "../Services/token-storage.service";
import {User} from "../interfaces/UserInterface";
import {GlobalDataService} from "../Services/global-data.service";
import {slideLeft} from "../animation/animation";
import {faMinus, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  animations:[slideLeft]
})
export class CartComponent implements OnInit{

  plusIcon=faPlus
  minusIcon=faMinus
  trashIcon=faTrash
  Persistence=0

  Menu:Dish[]=[]
  CartList:Dish[]=[]
  filter:filterInfo={fIngredients:[],fType:[],fTitle:[],fRatingMax:5,fRatingMin:0,fCostsMax:100000,fCostsMin:0,fCategory:[],fCuisine:[]}
  user:User= {
    username: "",
    email: "",
    roles:[],
    CartDishID: [],
    CartCount: [],
    dishHist: [],
    price: false,
  }
  isLoggedIn=false

  constructor(
    private dishService: DishServiceService,
    private tokenStorage: TokenStorageService,
    private authService:AuthService,
    private globalDataSerice:GlobalDataService) {
  }


  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.user=this.tokenStorage.getUser();
    }
    this.retrieveTutorials();
    this.getGlobalData()
  }

  retrieveTutorials(): void {
    this.dishService.getAll()
      .subscribe({
        next: (data) => {
          this.Menu = data;
          this.CartList=this.Menu.filter(x=>this.user.CartDishID.includes(x.id))
        },
        error: (e) => console.error(e)
      });
  }

  getGlobalData(){
    this.globalDataSerice.getAll().subscribe({
      next: (data) => {
        // @ts-ignore
        this.Persistence=data.find(x=> x.title='Persistence').value
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
  }
  deleteDish(dish:Dish){
    for(let i=0;i<this.user.CartDishID.length;i++){
      if(dish.id==this.user.CartDishID[i]){
        this.user.CartCount.splice(i,1)
        this.user.CartDishID.splice(i,1)
        this.tokenStorage.saveUser(this.user,this.Persistence)
        this.CartList=this.Menu.filter(x=>this.user.CartDishID.includes(x.id))
        this.authService.update(this.user).subscribe()
      }
    }
  }

  addDish(dish:Dish,value:number){
    if(this.user.CartDishID.includes(dish.id)){
      for(let i=0;i<this.user.CartDishID.length;i++){
        if(dish.id==this.user.CartDishID[i]){
          this.user.CartCount[i]+=value
          if(this.user.CartCount[i]<1){
            this.user.CartCount.splice(i,1)
            this.user.CartDishID.splice(i,1)
          }
          break
        }
      }
    }
    else{
      if(value>0){
        this.user.CartCount.push(value)
        this.user.CartDishID.push(dish.id)
      }
    }
    this.CartList=this.Menu.filter(x=>this.user.CartDishID.includes(x.id))
    this.tokenStorage.saveUser(this.user,this.Persistence)
    this.authService.update(this.user).subscribe()
  }
  NumberOfDishInCart(dish:Dish){
    if(this.user.CartDishID.includes(dish.id)){
      for(let i=0;i<this.user.CartDishID.length;i++){
        if(dish.id==this.user.CartDishID[i]){
          return this.user.CartCount[i]
        }
      }
    }
    return 0
  }
  isNotEmptyCart():boolean{
    return this.user.CartDishID.length>0
  }
  getCurrentMoney(dish:Dish):number{
    this.user=this.tokenStorage.getUser()
    if(this.user.price)return dish.qty[0]
    else return dish.qty[1]
  }
  getPriceSum():number{
    let sum=0
    for(let i=0;i<this.CartList.length;i++){
      sum+=this.NumberOfDishInCart(this.CartList[i]) * this.getCurrentMoney(this.CartList[i])
    }
    return sum
  }
  buyDish(){
    for(let i=0;i<this.user.CartDishID.length;i++) {
      if(!this.user.dishHist.includes(this.user.CartDishID[i])){
        this.user.dishHist.push(this.user.CartDishID[i])
      }
    }
    for(let i=0;i<this.user.CartDishID.length;i++){
      console.log(this.CartList)
      console.log(this.user)
      // @ts-ignore
      let temp:Dish=this.CartList.find(x => x.id==this.user.CartDishID[i])
      console.log(temp)
      temp.inStock-=this.user.CartCount[i]
      console.log(temp)
      this.dishService.update(this.user.CartDishID[i],temp).subscribe()
    }
    this.user.CartDishID=[]
    this.user.CartCount=[]
    this.CartList=this.Menu.filter(x=>this.user.CartDishID.includes(x.id))
    this.tokenStorage.saveUser(this.user,this.Persistence)
    this.authService.update(this.user).subscribe()
  }
  returnPriceSigil():string {
    this.user=this.tokenStorage.getUser()
    if (!this.user.price) {
      return " €"
    }
    return " $"
  }
}


