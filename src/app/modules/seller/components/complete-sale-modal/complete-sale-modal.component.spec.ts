import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteSaleModalComponent } from './complete-sale-modal.component';

describe('CompleteSaleModalComponent', () => {
  let component: CompleteSaleModalComponent;
  let fixture: ComponentFixture<CompleteSaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteSaleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteSaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
