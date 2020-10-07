import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCardOverviewComponent } from './multiple-card-overview.component';

describe('MultipleCardOverviewComponent', () => {
  let component: MultipleCardOverviewComponent;
  let fixture: ComponentFixture<MultipleCardOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleCardOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleCardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
