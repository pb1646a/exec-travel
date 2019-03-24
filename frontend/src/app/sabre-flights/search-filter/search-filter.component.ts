import { FilterService } from "./../services/filter/filter.service";
import { BehaviorSubject, Observable } from "rxjs";
import { RootItinObject, MarketingAirline } from "./../models/itinerary.model";
import { Component, OnInit } from "@angular/core";
import { PricedItinerary } from "../models/itinerary.model";
import { SearchService } from "../services/search/search.service";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-search-filter",
  templateUrl: "./search-filter.component.html",
  styleUrls: ["./search-filter.component.css"]
})
export class SearchFilterComponent implements OnInit {
  airlineFilterCol = ["airline", "select"];
  stopsFilterCol = ["stops", "select"];
  itineraries: PricedItinerary[] = [];
  itineraryData: RootItinObject;
  $$filters: Observable<{ airlines: any[]; stops: any[] }>;
  airlines = [];
  stops = [];
  $$filtered;
  $$itineraries: Observable<{
    itineraries: PricedItinerary[];
    itineraryData: RootItinObject;
  }>;
  constructor( public _filter: FilterService) {}

  keys(obj) {
    return Object.keys(obj);
  }
  typeOf(obj) {
    return typeof obj;
  }
  ngOnInit() {
    this._filter.getFilters();
    this.$$filters = this._filter.return$$Filters();
    //this.$$filters.subscribe(el => console.log(el));
  }

  checkAllSelected(selection, filter) {
    // checks is all selected
    return this._filter.isAllSelected(selection, filter);
  }
  onSelectAll(selection, filter) {
    // replaces select all
    return this._filter.selectAll(selection, filter);
  }

  getUnique(array, key) {
    const unique = array
      .map(item => item[key])
      .map((item, index, final) => {
        return final.indexOf(item) === index && index;
      })
      .filter(item => array[item])
      .map(item => array[item]);
    return unique;
  }
  onSelect() {


    return this._filter.selectFilter();
  }
}
