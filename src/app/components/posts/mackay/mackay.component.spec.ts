import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MackayComponent } from './mackay.component';

describe('MackayComponent', () => {
  let component: MackayComponent;
  let fixture: ComponentFixture<MackayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MackayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MackayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
