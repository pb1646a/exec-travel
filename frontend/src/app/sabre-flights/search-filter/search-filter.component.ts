import { FilterService } from "./../services/filter/filter.service";
import { Observable, of } from "rxjs";
import { Component, OnInit } from "@angular/core";


@Component({
  selector: "app-search-filter",
  templateUrl: "./search-filter.component.html",
  styleUrls: ["./search-filter.component.css"]
})
export class SearchFilterComponent implements OnInit {
  airlineFilterCol = ["airline", "select"];
  stopsFilterCol = ["stops", "select"];
  $$filters: Observable<{ airlines: any[]; stops: any[] }>;
$$selected;
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


  }

  checkAllSelected(selection, filter) {
    // checks is all selected
    return this._filter.isAllSelected(selection, filter);
  }
  onSelectAll(selection, filter) {
    // replaces select all
    return this._filter.selectAll(selection, filter);
  }

  onSelect() {
    return this._filter.selectFilter();
  }
}
