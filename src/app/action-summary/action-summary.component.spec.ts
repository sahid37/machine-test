import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSummaryComponent } from './action-summary.component';

describe('ActionSummaryComponent', () => {
  let component: ActionSummaryComponent;
  let fixture: ComponentFixture<ActionSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionSummaryComponent]
    });
    fixture = TestBed.createComponent(ActionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
