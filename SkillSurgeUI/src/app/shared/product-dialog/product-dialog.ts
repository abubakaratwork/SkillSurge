import { Component, Inject } from '@angular/core';
import { Product } from '../../core/services/localproduct.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from "@angular/material/dialog";

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

  constructor(private dialogRef: MatDialogRef<ProductDialog>, @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  categories = [
    { id: 1, name: 'Mobile' },
    { id: 2, name: 'Laptop' },
    { id: 3, name: 'Desktop' }
  ];

  selectedCategory: number | null = null;

  products: Product[] = [];

  product: Product = {
    id: '0000000-0000-0000-0000-0000000000000',
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  dialogAction: string = '';

  ngOnInit() {
    if (this.dialogData) {
      this.product = this.dialogData?.formData ?? this.product;
      this.dialogAction = this.dialogData?.action;
    }
  }

  submitForm(productForm: NgForm) {
    if (productForm.invalid) {
      Object.values(productForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    this.product.id = this.dialogAction == 'create' ? this.generateId() : this.product.id;
    this.product.createdAt = this.dialogAction == 'create' ? new Date() : this.product.createdAt;
    this.product.updatedAt = new Date();
    this.dialogRef.close(this.product)
    this.setFormDefault()
  }

  close() {
    this.dialogRef.close();
    this.setFormDefault();
  }

  setFormDefault() {
    this.product = {
      id: '0000000-0000-0000-0000-0000000000000',
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  generateId(): string {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
