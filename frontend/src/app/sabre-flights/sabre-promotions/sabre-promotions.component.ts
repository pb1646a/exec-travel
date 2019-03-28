import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormsService } from "src/app/common-components/services/forms.service";

@Component({
  selector: 'app-sabre-promotions',
  templateUrl: './sabre-promotions.component.html',
  styleUrls: ['./sabre-promotions.component.css']
})
export class SabrePromotionsComponent implements OnInit {
  images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);


  promotions=[{code: 'aa', link: ''}, {code:'ll', description: 'test2'}];

  constructor(private _forms: FormsService) { }
  get testForm(): FormGroup {
    return this._forms.form;
  }
  get fc() {
    return this._forms.form.controls;
  }
  controls(control) {
    return this._forms.form.get(control);
  }
  keys(object) {
    return Object.keys(object);
  }
  formFields = [
    { key: "test", value: "jfk" },

  ];
  ngOnInit() {
    this._forms.setFields(this.formFields);
  }

  onSubmit(value){
    console.log(value);
  }

}
