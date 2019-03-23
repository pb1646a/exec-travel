import { FilterService } from './../services/filter/filter.service';
import { map, count } from "rxjs/operators";
import { Observable, of, BehaviorSubject } from "rxjs";
import { RootItinObject, MarketingAirline } from "./../models/itinerary.model";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { PricedItinerary } from "../models/itinerary.model";
import { SearchService } from "../services/search/search.service";
import { SelectionModel, DataSource } from "@angular/cdk/collections";

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
  $$filters = new BehaviorSubject({ airlines: [], stops: [] });
  airlineselection = new SelectionModel(true, []);
  stopselection = new SelectionModel(true, []);
  airlines = [];
  stops = [];
  $$filtered;
  constructor(private _search: SearchService, private _filter: FilterService) {}
  @Output() filterChecked = new EventEmitter();

  keys(obj) {
    return Object.keys(obj);
  }
  typeOf(obj) {
    return typeof obj;
  }
  ngOnInit() {
    this.$$filtered = this._filter.returnasobs();
    this._search.returnInstantSearchAsObs().subscribe(itineraries => {
      this.airlineselection.clear();
      this.stopselection.clear();
      // check diff from spread operator

      this.airlines = this.getUnique(
        itineraries.itineraries.map(segments => {
          return segments.TPA_Extensions.ValidatingCarrier;
        }),
        "Code"
      );
      this.stops = itineraries.itineraries.map(segments => {
        return segments.AirItinerary.OriginDestinationOptions.OriginDestinationOption.map(
          segment => {
            return segment.FlightSegment.length;
          }
        );
      });

      this.stops = [].concat.apply([], this.stops);
      this.stops = this.stops.filter((curr, index) => {
        return this.stops.indexOf(curr) === index;
      });
      this.stops = this.stops.map(size => {
        return size - 1;
      });

      this.$$filters.next({
        airlines: [...this.airlines],
        stops: [...this.stops]
      });
     // this.selectAll(this.stopselection, "stops", "newsearch");
     // this.selectAll(this.airlineselection, "airlines", "newsearch");
    });
  }

  isAllSelected(selection, filter) {
    let numRows;
    this.$$filters.subscribe(data => {
      numRows = data[filter].length;
    });
    const selected = selection.selected.length;
    return selected === numRows;
  }

  selectAll(selection, filter, type?) {
      this.isAllSelected(selection, filter)
        ? selection.clear()
        : this.$$filters.subscribe(data => {
            data[filter].forEach(el => {
              selection.select(el);
            });
          });
          return this.onSelect(selection,filter);

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
  onSelect(selection, filter?) {
    this._filter.$$filter.next(selection.selected);

   // this.filterChecked.emit({name:filter, value: selection.selected});
  }

}
