import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserChangesService {
  private readonly changes = new Subject<void>();
  readonly changes$ = this.changes.asObservable();

  notify(): void {
    this.changes.next();
  }
}
