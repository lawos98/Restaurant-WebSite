import {Component, Input, OnInit,HostListener} from '@angular/core';
import {TokenStorageService} from "../Services/token-storage.service";
import {User} from "../interfaces/UserInterface";
import {AuthService} from "../Services/auth.service";
import {Router} from "@angular/router";
import {GlobalDataService} from "../Services/global-data.service";
import {
  faShoppingCart,
  faHome,
  faClipboardList,
  faUtensils,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt, faBars
} from "@fortawesome/free-solid-svg-icons";
import {fadeGrow, slideLeft, slideUp} from "../animation/animation";





@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations:[slideUp]
})

export class NavbarComponent implements OnInit {
  cartIcon=faShoppingCart
  menuIcon=faUtensils
  homeIcon=faHome
  addDishIcon=faClipboardList
  userEdit=faUser
  registerIcon=faUserPlus
  loginIcon=faSignInAlt
  logOutIcon=faSignOutAlt
  HamburgerIcon=faBars

  showMenu=true
  showHamburger=false

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    if(window.innerWidth>1200){
      this.showMenu=true
      this.showHamburger=false
    }
    if(window.innerWidth<=1200){
      this.showMenu=false
      this.showHamburger=true
    }
  }

  @Input() title!: string;

  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  user:User= {
    username: "",
    email: "",
    roles:[],
    CartDishID: [],
    CartCount: [],
    dishHist: [],
    price: false,
  }
  value=0

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    if (this.isLoggedIn && this.value==2){
      this.logout()
    }
  }

  constructor(private tokenStorageService: TokenStorageService, private authService: AuthService,private router: Router,private globalDataSerice:GlobalDataService) {
  }

  refreshGlobal(){
    this.globalDataSerice.getAll().subscribe({
      next: (data) => {
        // @ts-ignore
        this.value=data.find(x=> x.title=='Persistence').value
        this.isLoggedIn = !!this.tokenStorageService.getToken();

        if (this.isLoggedIn) {
          this.user = this.tokenStorageService.getUser();
          this.roles = this.user.roles;

          this.showAdminBoard = this.roles.includes('admin');
          this.showModeratorBoard = this.roles.includes('moderator');

          this.username = this.user.username;
        }
      },
      error: (e) => console.error(e)
    });
  }

  ngOnInit(): void {
    this.refreshGlobal()
    this.getGlobalData()
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  changePrice() {
    this.user = this.tokenStorageService.getUser()
    this.user.price = !this.user.price
    this.tokenStorageService.saveUser(this.user,this.Persistence)
    this.authService.update(this.user).subscribe()
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
  returnTextValue():string{
    if(this.user.price){
      return "$"
    }
    return "€"
  }

}
