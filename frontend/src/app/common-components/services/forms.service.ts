import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder, FormArray, FormControl } from "@angular/forms";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class FormsService {
  form;
  fields: FormArray;
  formArray;

  constructor(private fb: FormBuilder) {
    //  this.form = this.fb.group({});
  }
  createForm(name): FormGroup {
    return (name = this.fb.group({}));
  }
  setFields(fieldsArray, formName) {
    fieldsArray.forEach(field => {
      formName.addControl(
        field.key,
        new FormControl(field.value, Validators.compose(field.validators))
      );
    });
  }
  createDynamicFields(fields) {
    this.formArray = this.fb.group({});
    fields.forEach(field => {
      this.formArray.addControl(
        field.key,
        new FormControl(field.value, Validators.compose(field.validators))
      );
    });
    return this.formArray;
  }
  removeFields(control, formName) {
    formName.removeControl(control);
    formName.updateValueAndValidity();
  }
  addDynamicFields(array) {
    this.form.addControl("items", new FormArray([]));
    this.fields = this.form.get("items") as FormArray;
    this.fields.push(this.createDynamicFields(array));
  }
  addFormValidators(validators, form) {
let val = Validators.compose(validators);
    form.setValidators(val);

  }
}
