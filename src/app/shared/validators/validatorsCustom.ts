import {AbstractControl, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';

export class ValidatorsCustom {

  public static yearValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control?.value as number;

    if (value != null && (value < 1500 || value > 2100)) {
      return of({'yearValidator': true});
    }

    return of(null);
  }
}
