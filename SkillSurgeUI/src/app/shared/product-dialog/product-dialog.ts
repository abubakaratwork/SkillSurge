import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Product } from '../../core/models/interfaces/Product';
import { UtilityService } from '../../core/services/utility.service';
import { LocalAuthService } from '../../core/services/localauth.service';
import { Category } from '../../core/models/interfaces/Category';
import { LocalCategoryService } from '../../core/services/localcategory.service';
import { MatIcon } from "@angular/material/icon";
import { Currency } from '../../core/models/interfaces/Currency';
import { LocalCurrencyService } from '../../core/services/localcurrency.service';
import { LocalSubCategoryService } from '../../core/services/localsubcategory.service';
import { SubCategory } from '../../core/models/interfaces/SubCategory';

@Component({
  selector: 'app-product-dialog',
  imports: [
    FormsModule,
    NgSelectComponent
  ],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.css',
})
export class ProductDialog {

  repetitiveStyles = {
    validationErrorText: 'text-red-500 text-sm mt-1'
  }

  userId: string = '';

  constructor(
    private dialogRef: MatDialogRef<ProductDialog>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private utility: UtilityService,
    private authService: LocalAuthService,
    private categoryService: LocalCategoryService,
    private subCategoryService: LocalSubCategoryService,
    private currencyService: LocalCurrencyService
  ) {
    this.authService.user$.subscribe((u) => this.userId = u?.id!);
  }

  categories: Category[] = [];
  subCategories: SubCategory[] = [];

  selectedCategory: string | null = null;
  selectedSubCategory: string | null = null;

  subCategoryRequired: boolean = false;

  currencies: Currency[] = [];

  products: Product[] = [];

  product: Product = {
    id: '0000000-0000-0000-0000-0000000000000',
    name: '',
    description: '',
    price: 0,
    currency: "PKR",
    stockQuantity: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '',
    subCategoryId: '',
    userId: ''
  };

  dialogAction: string = '';

  ngOnInit() {
    if (this.dialogData) {
      this.product = this.dialogData?.formData ?? this.product;
      if (this.product.categoryId != null && this.product.categoryId != '')
        this.selectedCategory = this.product.categoryId;
      this.categories = this.categoryService.getAll().data ?? this.categories;
      this.dialogAction = this.dialogData?.action;
      this.currencies = this.currencyService.getAll();

      if (this.product.categoryId) {
        this.selectedCategory = this.product.categoryId;
        this.onCategoryChange(this.selectedCategory);
      }
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
    if(this.selectedSubCategory) product.subCategoryId = this.selectedSubCategory;
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
      currency: "PKR",
      stockQuantity: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: '',
      subCategoryId: '',
      userId: ''
    };

    return product;
  }

  currencySearchFn(term: string, item: any) {
    term = term.toLowerCase();

    return (
      item.country.toLowerCase().includes(term) ||
      item.currencyCode.toLowerCase().includes(term) ||
      item.currencyName.toLowerCase().includes(term)
    );
  }

  onCategoryChange(categoryId: string | null) {
    if (!categoryId) {
      this.subCategories = [];
      this.selectedSubCategory = null;
      this.subCategoryRequired = false; // no subcategories => not required
      return;
    }

    const result = this.subCategoryService.getByCurrencyId(categoryId);
    if (result.isSuccess && result.data.length > 0) {
      this.subCategories = result.data;
      this.selectedSubCategory = null;
      this.subCategoryRequired = true; // subcategories exist => required
    } else {
      this.subCategories = [];
      this.selectedSubCategory = null;
      this.subCategoryRequired = false; // no subcategories => not required
    }
  }
}
