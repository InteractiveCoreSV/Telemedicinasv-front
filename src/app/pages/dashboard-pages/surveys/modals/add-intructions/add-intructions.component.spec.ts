import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntructionsComponent } from './add-intructions.component';

describe('AddIntructionsComponent', () => {
  let component: AddIntructionsComponent;
  let fixture: ComponentFixture<AddIntructionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddIntructionsComponent]
    });
    fixture = TestBed.createComponent(AddIntructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
