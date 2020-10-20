import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Output('searching') changeEvent = new EventEmitter();
  queryInput: string = undefined;

  constructor() {}

  search(value: string) {
    if (value !== '') {
      this.changeEvent.emit({
        newValue: value,
      });
    } else {
      this.queryInput = undefined;
      this.changeEvent.emit({
        newValue: undefined,
      });
    }
  }

  clearQuery() {
    this.queryInput = undefined;
    this.changeEvent.emit({
      newValue: undefined,
    });
  }
}
