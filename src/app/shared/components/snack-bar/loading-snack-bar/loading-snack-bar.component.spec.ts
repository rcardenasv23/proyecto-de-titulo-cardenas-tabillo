import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSnackBarComponent } from './loading-snack-bar.component';

describe('LoadingSnackBarComponent', () => {
  let component: LoadingSnackBarComponent;
  let fixture: ComponentFixture<LoadingSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingSnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
