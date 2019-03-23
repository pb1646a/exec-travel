import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SabrePromotionsComponent } from './sabre-promotions.component';

describe('SabrePromotionsComponent', () => {
  let component: SabrePromotionsComponent;
  let fixture: ComponentFixture<SabrePromotionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SabrePromotionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SabrePromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
