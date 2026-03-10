import { Component, Inject } from '@angular/core';
import { FormArray, FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../core/services/utility.service';
import { LocalAuthService } from '../../core/services/localauth.service';
import { LocalCategoryService } from '../../core/services/localcategory.service';
import { Category } from '../../core/models/interfaces/Category';

@Component({
  selector: 'app-category-dialog',
  imports: [
    FormsModule
  ],
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.css',
})
export class CategoryDialog {
  constructor(private dialogRef: MatDialogRef<CategoryDialog>, @Inject(MAT_DIALOG_DATA) private dialogData: any, private utility: UtilityService, private authService: LocalAuthService, private categoryService: LocalCategoryService) {
    this.authService.user$.subscribe((u) => this.userId = u?.id!);
  }

  userId: string = '';

  repetitiveStyles = {
    validationErrorText: 'text-red-500 text-sm mt-1'
  }

  isSubCategory: boolean = false;

  category: Category = {
    id: '',
    name: '',
    description: '',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  dialogAction: string = '';

  ngOnInit() {
    if (this.dialogData) {
      this.category = this.dialogData?.formData ?? this.category;
      if (this.dialogData.parentId) {
        this.isSubCategory = true;
        this.category.parentCategoryId = this.dialogData.parentId;
      }
      this.dialogAction = this.dialogData?.action ?? 'create';
    }
  }

  submitForm(categoryForm: NgForm) {
    if (categoryForm.invalid) {
      Object.values(categoryForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const category: Category = { ...this.category };

    category.id = this.dialogAction === 'create' ? this.utility.generateId() : category.id;
    category.createdAt = this.dialogAction === 'create' ? new Date() : category.createdAt;
    category.updatedAt = new Date();

    this.dialogRef.close(category);
    this.resetForm();
  }

  close() {
    this.dialogRef.close();
    this.resetForm();
  }

  resetForm() {
    this.category = {
      id: '',
      name: '',
      description: '',
      parentCategoryId: '',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
