import { Component, OnInit } from '@angular/core';
import {AuthService} from "../Services/auth.service";
import {TokenStorageService} from "../Services/token-storage.service";
import {slideLeft} from "../animation/animation";
import {GlobalDataService} from "../Services/global-data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations:[slideLeft]
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  Persistence=0

  constructor(private authService: AuthService,
              private globalDataService:GlobalDataService,
              private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.isLoggedIn=true
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.getGlobalData()
  }

  getGlobalData(){
    this.globalDataService.getAll().subscribe({
      next: (data) => {
        // @ts-ignore
        this.Persistence=data.find(x=> x.title='Persistence').value
      },
      error: (e) => console.error(e)
    });
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken,this.Persistence);
        this.tokenStorage.saveUser(data,this.Persistence);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
