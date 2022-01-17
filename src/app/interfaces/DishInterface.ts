export interface Dish{
  id?:any;
  title:string;
  qty:number[];
  category:string;
  type:string;
  cuisine:string;
  inStock:number;
  ingredients:string[];
  ratings:number[];
  userRatings:any[],
  commentRatings:string[],
  commentWitoutRating:string[],
  userWitoutRating:string[],
  images:string[],
}
