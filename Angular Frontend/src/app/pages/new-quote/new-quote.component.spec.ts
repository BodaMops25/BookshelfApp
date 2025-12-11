import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewQuotePage } from './new-quote.component';

describe('NewBookComponent', () => {
  let component: NewQuotePage;
  let fixture: ComponentFixture<NewQuotePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewQuotePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
