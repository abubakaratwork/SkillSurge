import { Component, Inject } from '@angular/core';
import { SubCategory } from '../../core/models/interfaces/SubCategory';
import { Category } from '../../core/models/interfaces/Category';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalCategoryService } from '../../core/services/localcategory.service';
import { UtilityService } from '../../core/services/utility.service';
import { FormsModule, NgForm } from '@angular/forms';
import { LocalSubCategoryService } from '../../core/services/localsubcategory.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-sub-category-dialog',
  imports: [FormsModule, NgSelectComponent],
  templateUrl: './sub-category-dialog.html',
  styleUrl: './sub-category-dialog.css',
})
export class SubCategoryDialog {

  repetitiveStyles = {
    validationErrorText: 'text-red-500 text-sm mt-1'
  }

  subCategory: SubCategory = {
    id: '',
    name: '',
    categoryId: '',
    description: '',
    // isActive: true,
    createdAt: new Date(),
    udpatedAt: new Date()
  };

  categories: Category[] = [];
  dialogAction: 'create' | 'update' = 'create';

  constructor(
    private dialogRef: MatDialogRef<SubCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private subCategoryService: LocalSubCategoryService,
    private categoryService: LocalCategoryService,
    private utility: UtilityService
  ) {
    this.categories = this.categoryService.getAll().data ?? [];
  }

  ngOnInit() {
    if (this.dialogData) {
      this.subCategory = this.dialogData?.formData ?? this.subCategory;
      this.dialogAction = this.dialogData?.action ?? 'create';
    }
  }

  submitForm(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    const subCat: SubCategory = { ...this.subCategory };
    subCat.id = this.dialogAction === 'create' ? this.utility.generateId() : subCat.id;
    subCat.createdAt = this.dialogAction === 'create' ? new Date() : subCat.createdAt;
    subCat.udpatedAt = new Date();

    this.dialogRef.close(subCat);
    this.resetForm();
  }

  close() {
    this.dialogRef.close();
    this.resetForm();
  }

  resetForm() {
    this.subCategory = {
      id: '',
      name: '',
      categoryId: '',
      description: '',
      // isActive: true,
      createdAt: new Date(),
      udpatedAt: new Date()
    };
  }
}
