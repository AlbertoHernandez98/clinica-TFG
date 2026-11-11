import { FormControl } from '@angular/forms';
import { phoneValidator, storedPhoneValidator } from './custom.validators';

describe('Phone validation', () => {
  it('rejects values outside the database integer range', () => {
    const validate = phoneValidator();
    expect(validate(new FormControl('612345678'))).toBeNull();
    expect(validate(new FormControl('2147483647'))).toBeNull();
    expect(validate(new FormControl('2147483648'))).toEqual({ invalidPhone: true });
    expect(validate(new FormControl('123456789012345'))).toEqual({ invalidPhone: true });
  });

  it('accepts short legacy profile numbers and empty values', () => {
    const validate = storedPhoneValidator();
    expect(validate(new FormControl('12345'))).toBeNull();
    expect(validate(new FormControl(''))).toBeNull();
    expect(validate(new FormControl('2147483648'))).toEqual({ invalidPhone: true });
    expect(validate(new FormControl('12a'))).toEqual({ invalidPhone: true });
  });
});
