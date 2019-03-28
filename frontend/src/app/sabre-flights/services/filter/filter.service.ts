import { SelectionModel } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PricedItinerary, RootItinObject } from "../../models/itinerary.model";
import { SearchService } from "../search/search.service";

@Injectable({
  providedIn: "root"
})
export class FilterService {
  $$selectedFilter = new BehaviorSubject({ airlines: [], stops: [] });
  itineraries: PricedItinerary[] = [];
  itineraryData: RootItinObject;
  $$filters = new BehaviorSubject({ airlines: [], stops: [] });
  airlineselection = new SelectionModel(true, []);
  stopselection = new SelectionModel(true, []);
  airlines = [];
  stops = [];
  $$filtered;
  $$test;

  constructor(private _search: SearchService) {}

  isAllSelected(selection, filter) {
    let numRows;
    this.$$filters.subscribe(data => {
      numRows = data[filter].length;
    });
    const selected = selection.selected.length;

    return selected === numRows;
  }
  //(change)="$event? onSelectAll(_filter.airlineselection, 'airlines') :null; onSelect();"

  selectAll(selection, filter) {
    this.$$filters.subscribe(data => {
      data[filter].forEach(el => {
        selection.select(el);
      });
    });
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

  return$$Filters() {
    return this.$$filters.asObservable();
  }
  return$$SelectedFilters() {
    return this.$$selectedFilter.asObservable();
  }

  getFilters() {
    this._search.returnInstantSearchAsObs().subscribe(itineraries => {
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
      this.selectAll(this.airlineselection, "airlines");

      this.selectFilter();

    });
  }
  selectFilter() {
    this.$$selectedFilter.next({
      airlines: this.airlineselection.selected,
      stops: this.stopselection.selected
    });
  }
}
