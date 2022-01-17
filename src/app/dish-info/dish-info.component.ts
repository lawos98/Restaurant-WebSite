import {Component, OnInit} from '@angular/core';
import {Dish} from "../interfaces/DishInterface";
import {ActivatedRoute, Router} from "@angular/router";
import {DishServiceService} from "../Services/dish-service.service";
import {AuthService} from "../Services/auth.service";
import {TokenStorageService} from "../Services/token-storage.service";
import {User} from "../interfaces/UserInterface";
import {GlobalDataService} from "../Services/global-data.service";
import {faChevronCircleLeft,faChevronCircleRight} from "@fortawesome/free-solid-svg-icons";
import {slideLeft} from "../animation/animation";
import {Location} from "@angular/common";


@Component({
  selector: 'app-dish-info',
  templateUrl: './dish-info.component.html',
  styleUrls: ['./dish-info.component.css'],
  animations:[slideLeft]
})
export class DishInfoComponent implements OnInit{
  imagepage=0
  left=faChevronCircleLeft
  right=faChevronCircleRight

  dish: Dish = {
    id:"",
    title: '',
    qty: [0, 0],
    category: '',
    type: '',
    cuisine: '',
    inStock: 0,
    ingredients: [],
    ratings: [],
    userRatings: [],
    commentRatings: [],
    commentWitoutRating:[],
    userWitoutRating:[],
    images: []
  };

  constructor(
    private dishService: DishServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private globalDataSerice:GlobalDataService,
    private locate:Location) {
  }

  form: any = {
    comment: null,
    rating: 0
  };
  errorMessage = '';

  user:User= {
    username: "",
    email: "",
    roles:[],
    CartDishID: [],
    CartCount: [],
    dishHist: [],
    price: false,
  }
  isLoggedIn = false;
  isBaned=false
  showAdminBoard = false;
  showModeratorBoard = false;


  activeRating=0

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.user = this.tokenStorage.getUser();
      this.showAdminBoard = this.user.roles.includes('admin');
      this.showModeratorBoard = this.user.roles.includes('moderator');
      this.isBaned=this.user.roles.includes('ban')
    }
    this.getDish(this.route.snapshot.params["id"]);
    this.getGlobalData()
  }

  getDish(id: string): void {
    this.dishService.get(id)
      .subscribe({
        next: (data) => {
          this.dish = data;
        },
        error: (e) => console.error(e)
      });
  }

  getAVG(tab: number[]) {
    if(tab.length==0)return 0
    let sum = 0
    for (let i = 0; i < tab.length; i++) {
      sum += tab[i]
    }
    return sum / tab.length
  }

  rating(dish: number, number: number) {
    if (number > dish) {
      return "assets/imagies/starEmpty.png"
    }
    return "assets/imagies/starFull.png"
  }

  onSubmit(): void {
    if(this.showModeratorBoard) {
      if (this.dish.ratings.length == 0) {
        this.dish.commentWitoutRating = [this.form.comment]
        this.dish.userWitoutRating = [this.user.username]
      } else {
        this.dish.commentWitoutRating.push(this.form.comment)
        this.dish.userWitoutRating.push(this.user.username)
      }
    }
    else{
      if(this.dish.ratings.length==0){
        this.dish.ratings=[this.form.rating]
        this.dish.commentRatings=[this.form.comment]
        this.dish.userRatings=[this.user.username]
      }
      else {
        this.dish.ratings.push(this.form.rating)
        this.dish.commentRatings.push(this.form.comment)
        this.dish.userRatings.push(this.user.username)
      }
    }
    this.dishService.update(this.dish.id,this.dish).subscribe()
  }
  returnStarClas(number:Number):String{
    if(this.activeRating>=number)return "starAlt"
    return ""
  }
  checkIfUserCanRateThis():Boolean{
    if(this.isBaned)return false
    if(this.dish.userRatings.includes(this.user.username)||this.dish.userWitoutRating.includes(this.user.username))return false
    if(this.showModeratorBoard)return true
    return this.user.dishHist.includes(this.dish.id)
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
    this.user = this.tokenStorage.getUser();
    if(this.user.CartDishID.includes(dish.id)){
      for(let i=0;i<this.user.CartDishID.length;i++){
        if(dish.id==this.user.CartDishID[i]){
          return this.user.CartCount[i]
        }
      }
    }
    return 0
  }
  returnPrice(dish: Dish):string {
    this.user=this.tokenStorage.getUser()
    if (this.user.price) {
      return dish.qty[0] + " $"
    }
    return dish.qty[1] + " €"
  }

  getSource(dish:string):string{
    return "../../assets/imagies/"+dish
  }
  changeImagePage(v:number){
    this.imagepage+=v+this.dish.images.length
    this.imagepage%=this.dish.images.length
  }
  returnBack(){
    this.locate.back()
  }
}
