import { Component, OnInit } from '@angular/core';
import {Dish} from "../interfaces/DishInterface";
import {DishServiceService} from "../Services/dish-service.service";
import {ActivatedRoute} from "@angular/router";
import {slideUp} from "../animation/animation";



@Component({
  selector: 'app-edit-dish',
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css'],
  animations:[slideUp]
})
export class EditDishComponent implements OnInit {

  dish: Dish = {
    title: '',
    qty:[0,0],
    category:'',
    type:'',
    cuisine:'',
    inStock:0,
    ingredients:[],
    ratings:[],
    userRatings:[],
    commentRatings:[],
    commentWitoutRating:[],
    userWitoutRating:[],
    images:[]
  };
  ingredientsString=''
  submitted = false;

  constructor(
    private dishService: DishServiceService,
    private route:ActivatedRoute) {}

  ngOnInit(){
    this.getDish(this.route.snapshot.params["id"]);
  }

  saveTutorial(): void {
    this.dishService.update(this.dish.id,this.dish).subscribe()
    this.submitted=true
  }
  createIngredients():string[]{
    let temp=''
    for(let i=0;i<this.ingredientsString.length;i++){
      if(this.ingredientsString[i]==','){
        this.dish.ingredients.push(temp)
        temp=''
      }
      else{
        temp+=this.ingredientsString[i]
      }
    }
    return this.dish.ingredients
  }
  getIngredients(){
    this.ingredientsString=""
    for(let i=0;i<this.dish.ingredients.length;i++) {
      this.ingredientsString += this.dish.ingredients[i]
      if (i != this.dish.ingredients.length - 1) {
        this.ingredientsString += ","
      }
    }
  }

  getDish(id: string): void {
    this.dishService.get(id)
      .subscribe({
        next: (data) => {
          this.dish = data;
          this.getIngredients()
        },
        error: (e) => console.error(e)
      });
  }

  newTutorial(): void {
    this.submitted = false;
  }
}
