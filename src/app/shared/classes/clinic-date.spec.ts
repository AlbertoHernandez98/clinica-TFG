import { clinicToday } from './clinic-date';

describe('Clinic date', () => {
  it('uses the calendar day in Madrid across midnight', () => {
    expect(clinicToday(new Date('2031-02-03T23:30:00Z'))).toBe('2031-02-04');
    expect(clinicToday(new Date('2031-08-03T22:30:00Z'))).toBe('2031-08-04');
  });
});
