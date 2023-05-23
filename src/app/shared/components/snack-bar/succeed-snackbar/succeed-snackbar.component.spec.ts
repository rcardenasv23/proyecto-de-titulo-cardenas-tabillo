import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucceedSnackbarComponent } from './succeed-snackbar.component';

describe('SucceedSnackbarComponent', () => {
  let component: SucceedSnackbarComponent;
  let fixture: ComponentFixture<SucceedSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucceedSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucceedSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
