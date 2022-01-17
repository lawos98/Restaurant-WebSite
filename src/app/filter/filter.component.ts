import {Component, EventEmitter,Output} from '@angular/core';
import {filterInfo} from "../interfaces/FilterInterface";
import {Dish} from "../interfaces/DishInterface";
import {LabelType, Options} from "@angular-slider/ngx-slider";
import {DishServiceService} from "../Services/dish-service.service";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {slideLeft, slideUp} from "../animation/animation";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  animations: [slideUp,slideLeft]
})
export class FilterComponent{
  @Output() filterUpdate=new EventEmitter<filterInfo>()
  //
  Menu:Dish[]=[]
  filterTitle=[]
  filterType=[]
  filterCategory=[]
  filterCuisine=[]
  filterIngredients=[]
  //
  dropdownSettings: any = {
    singleSelection: false,
    idField: "item_id",
    textField: "item_text",
    enableCheckAll: false,
    itemsShowLimit: 5,
    closeDropDownOnSelection: false,
    allowSearchFilter: true,
  };

  showFilter=false
  IconFilter=faFilter

  constructor(private tutorialService: DishServiceService) {}

  ngOnInit(): void {
    this.retrieveTutorials();
    this.SendUpdateFilter()
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll()
      .subscribe({
        next: (data) => {
          this.Menu = data;
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveTutorials();
  }

  getIngredients() {
    let result = new Set;
    for (let i = 0; i < this.Menu.length; i++) {
      for (let j = 0; j < this.Menu[i].ingredients.length; j++) {
        result.add(this.Menu[i].ingredients[j])
      }
    }
    return Array.from(result)
  }
  getTitle() {
    return Array.from(new Set(this.Menu.map((itemInArray) => itemInArray.title)))
  }

  getCategory() {
    return Array.from(new Set(this.Menu.map((itemInArray) => itemInArray.category)))
  }

  getType() {
    return Array.from(new Set(this.Menu.map((itemInArray) => itemInArray.type)))
  }

  getCuisine() {
    return Array.from(new Set(this.Menu.map((itemInArray) => itemInArray.cuisine)))
  }
  SendUpdateFilter(){
    let update:filterInfo={
      fIngredients:this.filterIngredients,
      fCategory:this.filterCategory,
      fCostsMax:this.maxValue,
      fCostsMin:this.minValue,
      fCuisine:this.filterCuisine,
      fRatingMin:this.minRating,
      fRatingMax:this.maxRating,
      fTitle:this.filterTitle,
      fType:this.filterType
    }
    this.filterUpdate.emit(update)
  }
  minValue: number = 0;
  maxValue: number = 60;
  optionsMoney: Options = {
    floor: 0,
    ceil: 60,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min price:</b> " + value;
        case LabelType.High:
          return "<b>Max price:</b>" + value;
        default:
          return ""+value;
      }
    }
  }
  minRating: number = 0;
  maxRating: number = 5;
  optionsRating: Options = {
    floor: 0,
    ceil: 5,
    step: 0.1,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min rating:</b> " + value;
        case LabelType.High:
          return "<b>Max rating:</b>" + value;
        default:
          return "" + value;
      }
    }
  }
  changeShowFiler(){
    this.showFilter=!this.showFilter
  }
}


