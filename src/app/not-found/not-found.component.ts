import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppserviceService } from '../service/appservice.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(public navigation: AppserviceService, public route: Router) { }

  ngOnInit(): void {
    this.navigation.nav.next(true)
  }
  back(){
    this.route.navigate(["/"])
  }
}
