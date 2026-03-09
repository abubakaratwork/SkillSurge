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
import { ToastService } from '../../core/services/toast.service';
import { SpacedPricePipe } from '../../core/pipes/spaced-price-pipe';
import { ProductService } from '../../core/services/product.service';
import { CreateProductRequest, UpdateProductRequest } from '../../core/models/requests/ProductRequests';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, MatIcon, NgSelectModule, CommonModule, SpacedPricePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private localProdService: LocalProductService,
    private prodService: ProductService,
    private productDialog: MatDialog,
    private route: Router,
    private userService: UserService,
    private toastr: ToastService
  ) { }

  userId: string = '';

  repetitiveStyles = {
    validationErrorText: 'text-red-500 text-sm mt-1'
  }

  products: Product[] = [];
  isModalOpen = false;
  eventType: 'create' | 'update' = 'create';

  product: Product | null = null;

  ngOnInit() {
    this.userService.userProfile$.subscribe((u) => this.userId = u?.id!);
    // this.products = this.localProdService.getAllByUser().data ?? [];
    this.product = this.defaultProduct();
    this.prodService.getAll().subscribe((data) => {
      this.products = data.data ?? []
    });
  }

  refetch() {
    // this.products = this.localProdService.getAllByUser().data ?? [];
    this.prodService.getAll().subscribe((data) => {
      this.products = data.data ?? []
    });
  }

  openModal(event = "create", productId?: string) {
    let dialogRef = event === 'create' ?
      this.productDialog.open(ProductDialog, { data: { productId: null, action: event }, autoFocus: false }) :
      this.productDialog.open(ProductDialog, { data: { productId: productId, action: event }, autoFocus: false });

    dialogRef.afterClosed().subscribe((data: Product | undefined) => {
      if (data) {
        // let res;
        if (event === 'create') {
          const payload: CreateProductRequest = {
            name: data?.name,
            description: data.description,
            price: data.price,
            stockQuantity: data.stockQuantity,
            currency: data?.currency,
            isActive: data?.isActive,
            categoryId: data.subCategoryId
          }
          this.prodService.createProduct(payload).subscribe({
            next: (res) => {
              console.log(res);
              if (res.success) {
                this.toastr.success(res.message)
                this.refetch();
              }
            }
          })
          // res = this.localProdService.create(data);
        } else {
          const payload: UpdateProductRequest = {
            name: data.name,
            description: data.description,
            price: data.price,
            stockQuantity: data.stockQuantity,
            currency: data?.currency,
            isActive: data?.isActive,
            categoryId: data.subCategoryId
          }
          this.prodService.updateProduct(data.id, payload).subscribe({
            next: (res) => {
              console.log(res);
              if (res.success) {
                this.toastr.success(res.message)
                this.refetch();
              }
            }
          })
          // res = this.localProdService.update(data);
        }
        // if (res && res.isSuccess) {
        //   this.toastr.success(res.message);
        //   this.refetch();
        // }
        // else {
        //   this.toastr.error(res.message)
        // }
      }
    })
  }

  deleteProductById(id: string) {
    const res = this.prodService.deleteProduct(id).subscribe({
      next: res => {
        if (res.success) {
          this.refetch();
          this.toastr.success(res.message);
        }
      },
      error: err => {
        this.toastr.success(err.error?.message);
      }
    });
  }

  edit(id: string) {
    this.openModal("update", id);
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
