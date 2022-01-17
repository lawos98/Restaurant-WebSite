import { Component} from '@angular/core';
import {Dish} from "../interfaces/DishInterface";
import {filterInfo} from "../interfaces/FilterInterface";
import {faFilter, faMinus,faPlus} from '@fortawesome/free-solid-svg-icons';
import {DishServiceService} from "../Services/dish-service.service";
import {TokenStorageService} from "../Services/token-storage.service";
import {AuthService} from "../Services/auth.service";
import { User } from '../interfaces/UserInterface';
import {GlobalDataService} from "../Services/global-data.service";
import {fadeGrow, slideLeft} from "../animation/animation";


@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
  animations:[fadeGrow]
})
export class MenuListComponent{

  plusIcon=faPlus
  minusIcon=faMinus

  Menu:Dish[]=[]
  FilerMenuList:Dish[]=this.Menu
  filter:filterInfo={fIngredients:[],fType:[],fTitle:[],fRatingMax:5,fRatingMin:0,fCostsMax:100000,fCostsMin:0,fCategory:[],fCuisine:[]}
  // @ts-ignore
  user:User
  isLoggedIn=false
  page=1
  itemsPerPage=6
  itemsPerPageArray:Number[]=[]
  showFilter=false

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
  setItemsPerPage(){
    this.itemsPerPageArray=[]
    for(let i=1;i<this.FilerMenuList.length+1;i++){
      this.itemsPerPageArray.push(i)
    }
  }

  retrieveTutorials(): void {
    this.dishService.getAll()
      .subscribe({
        next: (data) => {
          this.Menu = data;
          this.FilerMenuList=data
          this.setItemsPerPage()
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveTutorials();
  }

  IconFilter=faFilter
  ratingIf: boolean = true

  checkClass(val1: number, val2: number) {
    if (val1 - val2 === 0) return 'Zero'
    if (val1 - val2 < 3) return 'Small'
    if (val1 - val2 < 5) return 'Medium'
    if (val1 - val2 < 10) return 'Big'
    return ''
  }
  findmax() {
    let max = 0
    for (let i = 0; i < this.Menu.length; i++) {
      if (this.Menu[i].qty[0] > max) {
        max = this.Menu[i].qty[0]
      }
    }
    return max
  }

  checkValue(val: number, odd: boolean) {
    if (this.findmax() === val)
      return 'boxPrice'
    if (odd) {
      return 'item-even'
    }
    return 'item-odd'
  }

  getAVG(tab: number[]) {
    if(tab.length==0)return 0
    let sum = 0
    for (let i = 0; i < tab.length; i++) {
      sum += tab[i]
    }
    return sum / tab.length
  }

  rating(dish: Dish, number: number) {
    if(dish.ratings.length==0)return "assets/imagies/starEmpty.png"
    if (number > this.getAVG(dish.ratings)) {
      return "assets/imagies/starEmpty.png"
    }
    return "assets/imagies/starFull.png"
  }
  returnIndexPrice():number{
    if(!this.isLoggedIn)return 0
    if(this.tokenStorage.getUser().price)return 0
    else return  1
  }
  returnPrice(dish: Dish):string {
    if (this.returnIndexPrice()==0) {
      return dish.qty[0] + " $"
    }
    return dish.qty[1] + " €"
  }

  onFilterUpdate($event:filterInfo){
    this.filter=$event
    this.FilerMenuList=this.Menu
    if($event.fTitle.length!=0)this.FilerMenuList=this.FilerMenuList.filter(x=>$event.fTitle.includes(x.title))
    if($event.fCategory.length!=0)this.FilerMenuList=this.FilerMenuList.filter(x=>$event.fCategory.includes(x.category))
    if($event.fType.length!=0)this.FilerMenuList=this.FilerMenuList.filter(x=>$event.fType.includes(x.type))
    if($event.fCuisine.length!=0)this.FilerMenuList=this.FilerMenuList.filter(x=>$event.fCuisine.includes(x.cuisine))
    let index=this.returnIndexPrice()
    this.FilerMenuList=this.FilerMenuList.filter(x=>x.qty[index]>=$event.fCostsMin)
    this.FilerMenuList=this.FilerMenuList.filter(x=>x.qty[index]<=$event.fCostsMax)
    this.FilerMenuList=this.FilerMenuList.filter(x=>this.getAVG(x.ratings)>=$event.fRatingMin)
    this.FilerMenuList=this.FilerMenuList.filter(x=>this.getAVG(x.ratings)<=$event.fRatingMax)
    // @ts-ignore
    if($event.fIngredients.length!=0)this.FilerMenuList=this.FilerMenuList.filter(x=>this.checkIngriedients(x.ingredients,$event.fIngredients))
  }
  checkIngriedients(tabx:String[],tab:String[]){
    for(let i=0;i<tab.length;i++){
      if(tabx.includes(tab[i]))return true
    }
    return false
  }
  Persistence=0
  getGlobalData(){
    this.globalDataSerice.getAll().subscribe({
      next: (data) => {
        // @ts-ignore
        this.Persistence=data.find(x=> x.title='Persistence').value
      },
      error: (e) => console.error(e)
    });
  }
  addDish(dish:Dish,value:number){
    this.user=this.tokenStorage.getUser()
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
  handlePageSizeChange(event: any): void {
    this.itemsPerPage = event.target.value;
    this.page = 1;
    this.retrieveTutorials();
  }
  getSource(dish:Dish):string{
    return "../../assets/imagies/"+dish.images[0]
  }
}


export interface DishEvent {
  index: number;
  value: number;
}

