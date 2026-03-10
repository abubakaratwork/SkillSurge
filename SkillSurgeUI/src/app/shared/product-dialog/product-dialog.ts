import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Product } from '../../core/models/interfaces/Product';
import { UtilityService } from '../../core/services/utility.service';
import { Category } from '../../core/models/interfaces/Category';
import { Currency } from '../../core/models/interfaces/Currency';
import { LocalCurrencyService } from '../../core/services/localcurrency.service';
import { SubCategory } from '../../core/models/interfaces/SubCategory';
import { UserService } from '../../core/services/user.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-dialog',
  imports: [
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './product-dialog.html',
  styleUrls: ['./product-dialog.css'],
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
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private currencyService: LocalCurrencyService
  ) {
    this.userService.userProfile$.subscribe((u) => this.userId = u?.id!);
  }

  categories: Category[] = [];
  subCategories: Category[] = [];

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

  ngOnChanges() { console.log('2 OnChanges'); }
  // ngOnInit() { console.log('3 OnInit'); }
  ngAfterViewInit() { console.log('4 AfterViewInit'); }
  ngOnDestroy() { console.log('5 OnDestroy'); }
  ngOnRender() { console.log('5 onrender'); }


  ngOnInit(): void {
    console.log('3 OnInit', this.dialogData);
    if (this.dialogData) {
      if (this.dialogData.productId) {
        const id = this.dialogData.productId;
        this.productService.getById(id).subscribe((data) => {
          this.product = { ...data.data, categoryId: data.data.parentCategoryId, subCategoryId: data.data.categoryId };

          console.log(this.product)
          if (this.product.categoryId && this.product.subCategoryId) {
            this.selectedCategory = this.product.categoryId;
            this.selectedSubCategory = this.product.subCategoryId;
            this.categoryService.getSubCategories(this.selectedCategory).subscribe(data => {
              this.subCategories = data.data!.filter(s =>
                !s.isDeleted || s.id === this.selectedSubCategory
              );
              this.subCategoryRequired = true;
            });
            this.fetchCategories();
          }
        });
      } else {
        this.fetchCategories();
      }
      this.dialogAction = this.dialogData?.action;
      this.currencies = this.currencyService.getAll();
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
    product.subCategoryId = this.selectedSubCategory!;
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

  onCategoryChange(categoryId: string) {
    this.categoryService.getSubCategories(categoryId).subscribe(data => {
      this.subCategories = data.data!.filter(s =>
        !s.isDeleted || s.id === this.product.subCategoryId
      );
      this.selectedSubCategory = null;
      this.subCategoryRequired = true;
    });
  }

  fetchCategories() {
    this.categoryService.getAll().subscribe(data => {
      console.log(data.data, this.selectedCategory)
      this.categories = data.data.filter((c: Category) =>
        (!c.isDeleted && (c.activeSubCategoriesCount ?? 0) > 0) ||
        c.id === this.selectedCategory
      );
    });
  }
}
