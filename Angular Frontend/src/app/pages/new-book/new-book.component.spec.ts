import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBookPage } from './new-book.component';

describe('NewBookComponent', () => {
  let component: NewBookPage;
  let fixture: ComponentFixture<NewBookPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBookPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
