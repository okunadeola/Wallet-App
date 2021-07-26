import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppserviceService {

  constructor() { }
  public nav = new BehaviorSubject(true)
}
