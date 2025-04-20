import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoancreationComponent } from './loancreation.component';

describe('LoancreationComponent', () => {
  let component: LoancreationComponent;
  let fixture: ComponentFixture<LoancreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoancreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoancreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
