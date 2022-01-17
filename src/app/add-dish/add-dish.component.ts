import { Component} from '@angular/core';
import {Dish} from "../interfaces/DishInterface";
import {DishServiceService} from "../Services/dish-service.service";
import {fadeGrow, slideLeft} from "../animation/animation";


@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css'],
  animations:[slideLeft,fadeGrow]
})
export class AddDishComponent{
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
    images:["dishTest.jpg"]
  };
  ingredientsString=''
  submitted = false;


  Menu:Dish[]=[]

  page=1
  itemsPerPage=6
  itemsPerPageArray:Number[]=[]

  setItemsPerPage(){
    this.itemsPerPageArray=[]
    for(let i=1;i<this.Menu.length+1;i++){
      this.itemsPerPageArray.push(i)
    }
  }
  handlePageSizeChange(event: any): void {
    this.itemsPerPage = event.target.value;
    this.page = 1;
    this.retrieveTutorials();
  }

  constructor(
    private dishService: DishServiceService) {}

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.dishService.getAll()
      .subscribe({
        next: (data) => {
          this.Menu = data;
          this.setItemsPerPage()
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveTutorials();
  }

  saveTutorial(): void {
    const data = {
      title: this.dish.title,
      qty: this.dish.qty,
      category: this.dish.category,
      type:this.dish.type,
      cuisine: this.dish.cuisine,
      inStock: this.dish.inStock,
      ingredients: this.createIngredients(),
      images:this.dish.images
    };

    this.dishService.create(data)
      .subscribe({
        next: (res) => {
          this.submitted = true;
          this.refreshList()
        },
        error: (e) => console.error(e)
      });
  }

  newTutorial(): void {
    this.submitted = false;
    this.dish = {
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
      images:["dishTest.jpg"]
    };
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
  deleteDish(dish:Dish){
    this.dishService.delete(dish.id).subscribe({
      next: (res) => {
        this.refreshList()
      },
      error: (e) => console.error(e)
    });
  }

  getSource(dish:Dish):string{
    return "../../assets/imagies/"+dish.images[0]
  }

}
