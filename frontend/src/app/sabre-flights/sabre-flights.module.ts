import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from './../common-components/common-component.module';
import { InstantSearchComponent } from './instant-search/instant-search.component';
import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SabrePromotionsComponent } from './sabre-promotions/sabre-promotions.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';

@NgModule({
  imports:[CommonModule, CommonComponentsModule, ReactiveFormsModule],
  declarations: [InstantSearchComponent, SearchResultsComponent, SabrePromotionsComponent, SearchFilterComponent],
  providers:[],
  exports:[InstantSearchComponent, SearchResultsComponent, SabrePromotionsComponent, SearchFilterComponent ]
})

export class SabreFlightsModule{}
