import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppserviceService } from '../service/appservice.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public email: string = ''
  public password: string = "";
  public error: string = "";
  public success: string = "";
  public button: boolean = true;
  public userForm: FormGroup = this.form.group({})


  constructor(public route: Router, public form: FormBuilder, public navigation: AppserviceService) { }

  ngOnInit(): void {
    this.userForm = this.form.group({
      email: ['', [Validators.email, Validators.required]],
      password: ["", [Validators.minLength(8), Validators.required]]
    })

    
    this.navigation.nav.next(true)
  }


  // emailValidator() {
  //   const re: any = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  //   if (this.email !== '') {
  //     if (!re.test(this.email) && this.email !== '') {
  //       this.error = "email is not valid"
  //       this.alertNullifier()
  //     }
  // //   }
  // }
  get f(){
    return this.userForm.controls
  }


  login() {


    if (localStorage.getItem('walletRegister') !== null) {
      let arr: any = localStorage.getItem("walletRegister")
      let arrData: any = JSON.parse(arr)
      let finder: any = arrData.find((val: any) => val.email === this.email && val.password === this.password)


      if (finder) {
        let user: any = []
        user.push({
          email: finder.email,
          password: finder.password
        })
        localStorage.setItem("walletLogin", JSON.stringify(user))
        this.route.navigate([`/dashboard/${finder.id}`])
      }
      else {
        this.error = "sorry user not found, kindly navigate to registration page or retry"
        this.alertNullifier()
      }
    } else {
      this.error = "You are not register, kindly navigate to the registration page"
      this.alertNullifier()
    }
  }


  removeAlert() {
    this.error = ''
  }

  alertNullifier() {
    setTimeout(() => {
      this.error = ''
    }, 5000)
  }

  infoNullifier() {
    setTimeout(() => {
      this.success = ''
    }, 1000)
  }

  logUp() {
    this.route.navigate(["/register"])
  }

}