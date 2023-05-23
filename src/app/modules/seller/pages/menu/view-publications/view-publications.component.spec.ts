import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPublicationsComponent } from './view-publications.component';

describe('ViewPublicationsComponent', () => {
  let component: ViewPublicationsComponent;
  let fixture: ComponentFixture<ViewPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPublicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
