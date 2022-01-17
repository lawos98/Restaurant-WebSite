import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CartComponent} from "./cart/cart.component";
import {MenuListComponent} from "./menu-list/menu-list.component";
import {AddDishComponent} from "./add-dish/add-dish.component";
import {DishInfoComponent} from "./dish-info/dish-info.component";
import {ErrorComponent} from "./error/error.component";
import {EditDishComponent} from "./edit-dish/edit-dish.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {UserEditComponent} from "./user-edit/user-edit.component"
import {AdminGuard} from "./guard/admin.guard"
import {AuthGuard} from "./guard/auth.guard";
import {ModGuard} from "./guard/mod.guard";

const routes: Routes = [
  {path: '', redirectTo: 'Home', pathMatch: 'full'},
  {path: 'Home', component: HomeComponent},
  {path: 'Cart', component: CartComponent,canActivate:[AuthGuard]},
  {path: 'Menu', component: MenuListComponent},
  {path: 'AddDish', component: AddDishComponent,canActivate:[AuthGuard,ModGuard]},
  {path: 'Dish/:id', component: DishInfoComponent,canActivate:[AuthGuard]},
  {path: 'DishEdit/:id', component: EditDishComponent,canActivate:[AuthGuard,ModGuard]},
  {path: 'UserEdit',component:UserEditComponent,canActivate:[AuthGuard,AdminGuard]},
  {path: 'Login', component: LoginComponent},
  {path: 'Register', component: RegisterComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
