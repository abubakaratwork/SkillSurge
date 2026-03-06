import { Component, effect, Inject } from '@angular/core';
import { LocalProductService } from '../../core/services/localproduct.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductDialog } from '../../shared/product-dialog/product-dialog';
import { Router } from '@angular/router';
import { Product } from '../../core/models/interfaces/Product';
import { LocalAuthService } from '../../core/services/localauth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpacedPricePipe } from '../../core/pipes/spaced-price-pipe';

@Component({
  selector: 'app-home',
  imports: [FormsModule, MatIcon, NgSelectModule, CommonModule, SpacedPricePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private localProdService: LocalProductService,
    private productDialog: MatDialog,
    private route: Router,
    private authService: LocalAuthService,
    private toastr: ToastService
  ) {
    effect(() => {
      this.authService.user$.subscribe((u) => this.userId = u?.id!);
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
    this.products = this.localProdService.getAllByUser().data ?? [];
    this.product = this.defaultProduct();
  }

  refetch() {
    this.products = this.localProdService.getAllByUser().data ?? [];
  }

  openModal(event = "create") {
    let dialogRef = event === 'create' ?
      this.productDialog.open(ProductDialog, { data: { formData: null, action: event }, autoFocus: false }) :
      this.productDialog.open(ProductDialog, { data: { formData: this.product, action: event }, autoFocus: false });

    dialogRef.afterClosed().subscribe((data: Product | undefined) => {
      if (data) {
        let res;
        if (event === 'create') {
          res = this.localProdService.create(data);
        } else {
          res = this.localProdService.update(data);
        }
        if (res && res.isSuccess) {
          this.toastr.success(res.message);
          this.refetch();
        }
        else {
          this.toastr.error(res.message)
        }
      }
    })
  }

  deleteProductById(id: string) {
    const res = this.localProdService.deleteById(id);
    this.refetch();
    this.toastr.success(res.message);
  }

  edit(id: string) {
    const existing = this.localProdService.getById(id).data;
    this.product = existing ? existing : {
      id: '0000000-0000-0000-0000-0000000000000',
      name: '',
      description: '',
      price: 0,
      currency: "PKR",
      stockQuantity: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: this.userId,
      categoryId: '',
      subCategoryId: '',
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
      currency: "PKR",
      stockQuantity: 0,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: this.userId!,
      categoryId: '',
      subCategoryId: '',
    };
    return product;
  }
}
