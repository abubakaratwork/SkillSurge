import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Product } from '../../core/models/interfaces/Product';
import { UtilityService } from '../../core/services/utility.service';
import { LocalAuthService } from '../../core/services/localauth.service';
import { Category } from '../../core/models/interfaces/Category';
import { LocalCategoryService } from '../../core/services/localcategory.service';

@Component({
  selector: 'app-product-dialog',
  imports: [
    FormsModule,
    NgSelectComponent,
  ],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.css',
})
export class ProductDialog {

  repetitiveStyles = {
    validationErrorText: 'text-red-500 text-sm mt-1'
  }

  userId: string = '';

  constructor(private dialogRef: MatDialogRef<ProductDialog>, @Inject(MAT_DIALOG_DATA) private dialogData: any, private utility: UtilityService, private authService: LocalAuthService, private categoryService: LocalCategoryService) {
    this.userId = this.authService.user()?.id!;
  }

  categories: Category[] = [];

  selectedCategory: string | null = null;

  products: Product[] = [];

  product: Product = {
    id: '0000000-0000-0000-0000-0000000000000',
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '',
    userId: ''
  };

  dialogAction: string = '';

  ngOnInit() {
    if (this.dialogData) {
      this.product = this.dialogData?.formData ?? this.product;
      if (this.product.categoryId != null && this.product.categoryId != '') 
        this.selectedCategory = this.product.categoryId;
      this.categories = this.categoryService.getAll();
      this.dialogAction = this.dialogData?.action;
    }
  }

  submitForm(productForm: NgForm) {
    if (productForm.invalid) {
      Object.values(productForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    let product = this.product!;

    product.id = this.dialogAction == 'create' ? this.utility.generateId() : product.id;
    product.createdAt = this.dialogAction == 'create' ? new Date() : product.createdAt;
    product.categoryId = this.selectedCategory!;
    product.updatedAt = new Date();
    if (this.dialogAction == 'create') product.userId = this.userId;
    this.dialogRef.close(this.product)
    this.setFormDefault()
  }

  close() {
    this.dialogRef.close();
    this.setFormDefault();
  }

  setFormDefault() {
    let product: Product = {
      id: '0000000-0000-0000-0000-0000000000000',
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: '',
      userId: ''
    };

    return product;
  }
}
