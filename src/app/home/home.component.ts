import { Component, OnInit } from '@angular/core';import { Router } from '@angular/router';
import { AppserviceService } from '../service/appservice.service';


interface Todo{
  todo: String,
  time:String
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(public route:Router, public navigation: AppserviceService) {}
  public todo: String = "";
  public todoTime: string = "";
  public todoArr : Array<Todo>= [];

  ngOnInit(): void {
    this.navigation.nav.next(true)
  } 

  routToRegister(){
    this.route.navigate(["/register"])
  }

}