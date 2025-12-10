import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteItemComponent } from './quoteItem.component';

describe('BookPreviewComponent', () => {
  let component: QuoteItemComponent;
  let fixture: ComponentFixture<QuoteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
