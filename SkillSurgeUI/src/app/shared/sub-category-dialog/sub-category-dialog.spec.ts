import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryDialog } from './sub-category-dialog';

describe('SubCategoryDialog', () => {
  let component: SubCategoryDialog;
  let fixture: ComponentFixture<SubCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategoryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategoryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
