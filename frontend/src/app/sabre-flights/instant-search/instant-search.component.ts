import { SearchService } from "./../services/search/search.service";
import { City } from "./../models/cities.model";
import { FormGroup, Validators } from "@angular/forms";
import { CitiesService } from "./../services/cities/cities.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormsService } from "src/app/common-components/services/forms.service";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  startWith
} from "rxjs/operators";
import * as _moment from "moment";
import { of, BehaviorSubject } from "rxjs";
import { FilterService } from "../services/filter/filter.service";
import { CustomValidators } from "src/app/common-components/services/validators/custom-validators";
//import {default as _rollupMoment} from 'moment';
const moment = _moment; //_rollupMoment ||
@Component({
  selector: "app-instant-search",
  templateUrl: "./instant-search.component.html",
  styleUrls: ["./instant-search.component.css"]
})
export class InstantSearchComponent implements OnInit, OnDestroy {
  formFields = [
    { key: "departure", value: "jfk", validators: [Validators.required] },
    { key: "destination", value: "lax", validators: [Validators.required] },
    {
      key: "departuredate",
      value: moment(),
      validators: [Validators.required]
    },
    {
      key: "returndate",
      value: moment(),
      validators: [Validators.required]
    },
    {
      key: "numberofpassengers",
      value: "1",
      validators: [Validators.required, Validators.min(1)]
    }
  ];

  cities: City[] = [];
  $$desCities;
  $$depCities;
  return = true;
  $$direction = new BehaviorSubject(this.return);
  instantSearchForm: FormGroup;
  constructor(
    public _cities: CitiesService,
    public _forms: FormsService,
    public _search: SearchService,
    public _filter: FilterService
  ) {}

  get fc() {
    return this.instantSearchForm.controls;
  }
  controls(control) {
    return this.instantSearchForm.get(control);
  }
  keys(object) {
    return Object.keys(object);
  }
  ngOnInit() {
    this.instantSearchForm = this._forms.createForm(this.instantSearchForm);
    this._cities.getCities();
    this._cities.getCitiesAsObs().subscribe(city => {
      this.cities = city;
    });

    this._forms.setFields(this.formFields, this.instantSearchForm);
    this._forms.addFormValidators(
      [
        CustomValidators.maxLengthOfStay("departuredate", "returndate"),
        CustomValidators.validReturnDate("departuredate", "returndate")
      ],
      this.instantSearchForm
    );
    this.$$direction.subscribe(checked => {
      if (checked) {
        this._forms.setFields([this.formFields[3]], this.instantSearchForm);
        this._forms.addFormValidators(
          [
            CustomValidators.maxLengthOfStay("departuredate", "returndate"),
            CustomValidators.validReturnDate("departuredate", "returndate")
          ],
          this.instantSearchForm
        );
      }
      if (!checked) {
        this._forms.addFormValidators("", this.instantSearchForm);
        this._forms.removeFields("returndate", this.instantSearchForm);
      }
    });

    // ****** could use same $$ for filter
    this.controls("departure")
      .valueChanges.pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.$$depCities = of(this.filter(term));
      });

    this.controls("destination")
      .valueChanges.pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.$$desCities = of(this.filter(term));
      });
  }

  private filter(term) {
    const filterTerm = term.toLowerCase();
    return this.cities.filter(city => {
      return (
        city.name.toLowerCase().includes(filterTerm) ||
        city.code.toLowerCase().includes(filterTerm)
      );
    });
  }

  onInstant(value) {
    this._filter.$$filters.next({ airlines: [], stops: [] });
    this._filter.$$selectedFilter.next({ airlines: [], stops: [] });
    this._search.$$errors.next([""]);
    this._filter.airlineselection.clear();
    return this._search.getInstantFlights(value);
  }
  onDirection() {
    this.return = !this.return;
    this.$$direction.next(this.return);
  }
  ngOnDestroy() {
    this.$$depCities.unsubscribe();
    this.$$desCities.unsubscribe();
  }
}

/*
  this.$$desCities = this.controls("destination").valueChanges.pipe(
      startWith(""),
      debounceTime(100),
      distinctUntilChanged(),
      map(term => {
        return this.filter(term);
      })
    );
    */
