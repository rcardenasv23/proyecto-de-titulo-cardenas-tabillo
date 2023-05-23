import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyDetailComponent } from './buy-detail.component';

describe('BuyDetailComponent', () => {
  let component: BuyDetailComponent;
  let fixture: ComponentFixture<BuyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
