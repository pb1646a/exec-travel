import {
  RootItinObject,
  PricedItinerary
} from "./../../models/itinerary.model";
import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.prod";
import { Subject, Observable, BehaviorSubject, of } from "rxjs";
import * as _moment from "moment";
const moment = _moment;

@Injectable({
  providedIn: "root"
})
export class SearchService {
  baseUrl = environment.baseUrl;
  itineraries: PricedItinerary[] = [];
  itineraryData: RootItinObject;
  $$itineraries: BehaviorSubject<{
    itineraries: PricedItinerary[];
    itineraryData: RootItinObject;
  }> = new BehaviorSubject({
    itineraries: this.itineraries,
    itineraryData: this.itineraryData
  });
  errors=[];
  $$errors = new BehaviorSubject(this.errors);

  constructor(private http: HttpClient) {}
  getInstantFlights(data) {
    data.departuredate = moment(data.departuredate).format("YYYY-MM-DD");
    data.returndate?data.returndate = moment(data.returndate).format("YYYY-MM-DD"):null;
    const params = data;
    this.http
      .get<{ message: string; data: RootItinObject }>(
        `${this.baseUrl}api/sabre/instant`,
        {
          params
        }
      )
      .pipe(
        map(
          response => {
            if (response.message.toLowerCase() !== "success") {

              throw new Error(response.message);
            }
            return {
              searchData: {
                ReturnDateTime: response.data.ReturnDateTime,
                DepartureDateTime: response.data.DepartureDateTime,
                DestinationLocation: response.data.DestinationLocation,
                OriginLocation: response.data.OriginLocation,
                Page: response.data.Page,
                Links: response.data.Links
              },
              PricedItinerary: response.data.PricedItineraries.map(
                itinerary => {
                  return itinerary;
                }
              )
            };
          },
          catchError(err => {

            return of(err);
          })
        )
      )
      .subscribe(
        formatted => {
          this.itineraryData = formatted.searchData;
          this.itineraries = formatted.PricedItinerary;
          this.$$itineraries.next({
            itineraries: [...this.itineraries],
            itineraryData: this.itineraryData
          });
        },
        err => {
          console.log(JSON.parse(err.message));
          this.errors = [JSON.parse(err.message)];
          this.$$errors.next([...this.errors]);
        }
      );
  }

  returnInstantSearchAsObs(): Observable<{
    itineraries: PricedItinerary[];
    itineraryData: RootItinObject;
  }> {
    return this.$$itineraries.asObservable();
  }
  return$$errors(){
    return this.$$errors.asObservable();
  }
}
