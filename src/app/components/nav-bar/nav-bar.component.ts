import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @Output('searching') changeEvent = new EventEmitter();
  queryInput: string = undefined;

  constructor() {}

  ngOnInit(): void {}

  search(value) {
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
