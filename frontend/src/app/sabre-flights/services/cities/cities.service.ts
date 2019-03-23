import { map, mergeMap } from "rxjs/operators";
import { City } from "./../../models/cities.model";
import { Injectable } from "@angular/core";
import { environment } from "./../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CitiesService {
  baseUrl = environment.baseUrl;
  cities: City[] = [{type:'', name:'', code:'', airports:'', rail:'', other:''}];
  $$cities: Subject<City[]> = new Subject();
  $$airports: Subject<any[]> = new Subject();
  airports: any[] = [];
  constructor(private http: HttpClient) {}
  getCities() {
    this.http
      .get<{ message: string; data: City[] }>(`${this.baseUrl}api/sabre/`)
      .pipe(
      map(response => {
          return response.data.map(city => {
            return {
              type: 'city',
              code: city.code,
              name: city.name,
              airports: city.transport.map(item=>{
                return item.Airports;
              }),
              rail: city.transport.map(item=>{
                return item['Rail stations'];
              }),
              other: city.transport.map(item=>{
                return item.Others;
              })
            };
          });
        })
      )
      .subscribe(formatted => {
        this.cities = formatted;
        this.$$cities.next([...this.cities]);
      });

  }
  getCitiesAsObs(): Observable<City[]> {
    return this.$$cities.asObservable();
  }
  getAirports(code) {
   return this.http
      .get<{ message: string; data: City[] }>(`${this.baseUrl}api/sabre/airports`)
      .pipe(
        map(response => {
          return response.data.map(city => {
            return {
              code: city.code,
              name: city.name
            };
          });
        })
      )


  }
  getAirportsAsObs(): Observable<City[]> {
    return this.$$cities.asObservable();
  }

}
