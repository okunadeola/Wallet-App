import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../service/appservice.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public _service : AppserviceService) { }
  public name :any
  ngOnInit(): void {
    this._service.nav.subscribe(data=>{
      this.name = data
    })
}
}
