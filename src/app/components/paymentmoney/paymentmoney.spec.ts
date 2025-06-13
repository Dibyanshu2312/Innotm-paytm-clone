import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paymentmoney } from './paymentmoney';

describe('Paymentmoney', () => {
  let component: Paymentmoney;
  let fixture: ComponentFixture<Paymentmoney>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paymentmoney]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paymentmoney);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
