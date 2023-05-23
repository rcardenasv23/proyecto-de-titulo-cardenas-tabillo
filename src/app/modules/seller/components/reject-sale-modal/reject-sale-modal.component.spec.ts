import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSaleModalComponent } from './reject-sale-modal.component';

describe('RejectSaleModalComponent', () => {
  let component: RejectSaleModalComponent;
  let fixture: ComponentFixture<RejectSaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSaleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectSaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
