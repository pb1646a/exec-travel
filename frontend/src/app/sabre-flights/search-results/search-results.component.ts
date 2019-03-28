import { FilterService } from "./../services/filter/filter.service";
import { map } from "rxjs/operators";
import {
  PricedItinerary,
  RootItinObject,
  MarketingAirline
} from "./../models/itinerary.model";
import { SearchService } from "./../services/search/search.service";
import { Component, OnInit } from "@angular/core";
import { Observable, of, from } from "rxjs";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.css"]
})
export class SearchResultsComponent implements OnInit {
  itineraries: PricedItinerary[] = [];
  itineraryData: RootItinObject;
  $$itineraries: Observable<{
    itineraries: PricedItinerary[];
    itineraryData: RootItinObject;
  }>;
  $$filtered;
  errors;
  $$errors;
  pageIndex = 0;
  lowerLimit = 0;
  pageSize = 10;
  higherLimit = this.pageSize * (this.pageIndex + 1);
  pageSizeOptions = [10, 15, 25];

  constructor(
    private _search: SearchService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _filter: FilterService
  ) {
    this.matIconRegistry.addSvgIcon(
      "airplane_takeoff",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/svg/airplane-takeoff.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "airplane_landing",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/svg/airplane-landing.svg"
      )
    );
  }
  keys(obj) {
    return Object.keys(obj);
  }
  typeOf(obj) {
    return typeof obj;
  }
  ngOnInit() {
    this._search.returnInstantSearchAsObs().subscribe(it => {
      this.itineraries = it.itineraries;
      this.itineraryData = it.itineraryData;
      return (this.$$itineraries = of(it));
    });
    this.$$errors = this._search.return$$errors();
    // filter strategy filter->filter or filter && filter && compare

    this.$$filtered = this._filter.return$$SelectedFilters();
    this.$$filtered
      .pipe(
        map(filter => {
          return filter;
        })
      )
      .subscribe(filter => {
        let final = filter.airlines.map(filt => {
          return this.itineraries.filter(it => {
            return it.TPA_Extensions.ValidatingCarrier.Code.includes(filt.Code)
              ? it
              : false;
          });
        });
        final = final.flat();
        return this.$$itineraries = of({
          itineraries: final,
          itineraryData: this.itineraryData
        });
      });

  }


  pageChange(event) {
    this.pageSize = event.pageSize;
    this.lowerLimit = event.pageSize * event.pageIndex;
    this.higherLimit = event.pageSize * (event.pageIndex + 1);
  }
}
