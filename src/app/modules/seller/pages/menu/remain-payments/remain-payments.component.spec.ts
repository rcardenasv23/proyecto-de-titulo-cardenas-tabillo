import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainPaymentsComponent } from './remain-payments.component';

describe('RemainPaymentsComponent', () => {
  let component: RemainPaymentsComponent;
  let fixture: ComponentFixture<RemainPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemainPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
