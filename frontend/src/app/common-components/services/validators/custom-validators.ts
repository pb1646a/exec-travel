import { FormControl, FormGroup } from "@angular/forms";
import * as _moment from "moment";
const moment = _moment;
export class CustomValidators {
  static cannotContainSpace(formControl: FormControl) {
    if (formControl.value.indexOf(" ") >= 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }
  static maxLengthOfStay(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.maxLengthOfStay) {
        return;
      }
      const depDate = moment(control.value);
      const returnDate = moment(control.value);
      const max = depDate.add(16,'days');
      if (matchingControl.value>max) {
        matchingControl.setErrors({ maxLengthOfStay: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

}
