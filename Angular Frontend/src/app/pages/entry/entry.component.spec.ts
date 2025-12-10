import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPage } from './entry.component';

describe('EntryComponent', () => {
  let component: EntryPage;
  let fixture: ComponentFixture<EntryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
