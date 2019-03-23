import { FilterService } from './../services/filter/filter.service';
import { map } from "rxjs/operators";
import { distinctUntilChanged } from "rxjs/operators";
import { PricedItinerary, RootItinObject, MarketingAirline } from "./../models/itinerary.model";
import { SearchService } from "./../services/search/search.service";
import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
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
  $$test;
  pageIndex = 0;
  lowerLimit = 0;
  pageSize = 15;
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
    this.$$itineraries = this._search.returnInstantSearchAsObs();
    this.$$test = this._search.returnInstantSearchAsObs();
    this.$$filtered = this._filter.returnasobs();
  
  }
  filterApplied(filter) {
  console.log(filter);
  }

  pageChange(event) {
    this.pageSize = event.pageSize;
    this.lowerLimit = event.pageSize * event.pageIndex;
    this.higherLimit = event.pageSize * (event.pageIndex + 1);
  }
}
