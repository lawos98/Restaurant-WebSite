import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { DishInfoComponent } from './dish-info/dish-info.component';
import { ErrorComponent } from './error/error.component';
import { FilterComponent } from './filter/filter.component';
import { AddDishComponent } from './add-dish/add-dish.component';
import { HomeComponent } from './home/home.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { NavbarComponent } from './navbar/navbar.component';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { HttpClientModule } from '@angular/common/http';
import { EditDishComponent } from './edit-dish/edit-dish.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {GalleryModule} from "@ks89/angular-modal-gallery";
import { UserEditComponent } from './user-edit/user-edit.component';
import {NgxPaginationModule} from "ngx-pagination";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {GlobalDataService} from "./Services/global-data.service";
import {StickyNavModule} from "ng2-sticky-nav";




@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    DishInfoComponent,
    ErrorComponent,
    FilterComponent,
    AddDishComponent,
    HomeComponent,
    MenuListComponent,
    NavbarComponent,
    EditDishComponent,
    RegisterComponent,
    LoginComponent,
    UserEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
