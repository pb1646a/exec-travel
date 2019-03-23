import { MinuteSecondsPipe } from './pipes/time.pipe';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateFormat } from './date.model';
import { FootBarComponent } from './foot-bar/foot-bar.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatToolbarModule,
  MatAutocompleteModule,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatExpansionModule,
  MatAccordion,
  MatDividerModule,
  MatPaginatorModule,
  MatTableModule,
  MatCheckboxModule,

} from "@angular/material";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from './nav-bar/nav-bar.component';



@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule


  ],
  declarations: [NavBarComponent, FootBarComponent, MinuteSecondsPipe],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    NgbModule,
    NavBarComponent,
    FootBarComponent,
    MatAutocompleteModule,
    MatExpansionModule,
    MatDividerModule,
    MatPaginatorModule,
    MinuteSecondsPipe,
    MatTableModule,
    MatCheckboxModule

  ],
  providers:[
    {provide: DateAdapter, useClass: MomentDateAdapter, deps:[MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]

})
export class CommonComponentsModule {}
