import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCardOverviewComponent } from './single-card-overview.component';

describe('SingleCardOverviewComponent', () => {
  let component: SingleCardOverviewComponent;
  let fixture: ComponentFixture<SingleCardOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCardOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
