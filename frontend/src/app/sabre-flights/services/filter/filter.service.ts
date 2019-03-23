import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
$$filter= new BehaviorSubject([{Code:''}]);

  constructor() { }
returnasobs(){
  return this.$$filter.asObservable();
}
}
