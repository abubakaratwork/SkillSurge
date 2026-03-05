import { Component, effect, Inject } from '@angular/core';
import { LocalProductService } from '../../core/services/localproduct.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductDialog } from '../../shared/product-dialog/product-dialog';
import { Router } from '@angular/router';
import { Product } from '../../core/models/interfaces/Product';
import { LocalAuthService } from '../../core/services/localauth.service';

@Component({
  selector: 'app-home',
  imports: [DatePipe, FormsModule, MatIcon, NgSelectModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private localProdService: LocalProductService, private productDialog: MatDialog, private route: Router, private authService: LocalAuthService) {
    effect(() => {
      this.userId = this.authService.user()?.id!;
    })
  }

  userId: string = '';

  repetitiveStyles = {
    validationErrorText: 'text-red-500 text-sm mt-1'
  }

  cities = [
    { id: 1, name: 'Karachi' },
    { id: 2, name: 'Lahore' },
    { id: 3, name: 'Islamabad' }
  ];

  selectedCity: number | null = null;

  products: Product[] = [];
  isModalOpen = false;
  eventType: 'create' | 'update' = 'create';

  product: Product | null = null;

  ngOnInit() {
    this.products = this.localProdService.getAllByUser() ?? [];
    this.product = this.defaultProduct();
  }

  refetch() {
    this.products = this.localProdService.getAllByUser() ?? [];
  }

  openModal(event = "create") {
    let dialogRef = event === 'create' ?
      this.productDialog.open(ProductDialog, { data: { formData: null, action: event }, autoFocus: false }) :
      this.productDialog.open(ProductDialog, { data: { formData: this.product, action: event }, autoFocus: false });

    dialogRef.afterClosed().subscribe((data: Product | undefined) => {
      if (data) {
        if (event === 'create') {
          this.localProdService.create(data);
        } else {
          this.localProdService.update(data);
        }
        this.refetch();
      }
    })
  }

  deleteProductById(id: string) {
    this.localProdService.deleteById(id);
    this.refetch();
    alert(`Product is deleted with id: ${id}`)
  }

  edit(id: string) {
    const existing = this.localProdService.getById(id);
    this.product = existing ? existing : {
      id: '0000000-0000-0000-0000-0000000000000',
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: this.userId,
      categoryId: ''
    };

    this.openModal("update");
  }

  formatId(id: string) {
    return id.replace(/\D/g, '').slice(0, 8);
  }

  viewProduct(id: string) {
    this.route.navigate([`/product/${id}`]);
  }

  defaultProduct(): Product {
    let product: Product = {
      id: '',
      name: '',
      price: 0,
      stockQuantity: 0,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: this.userId!,
      categoryId: ''
    };
    return product;
  }
}
