import { Component, effect } from '@angular/core';
import { LocalCategoryService } from '../../core/services/localcategory.service';
import { Category } from '../../core/models/interfaces/Category';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalAuthService } from '../../core/services/localauth.service';
import { CategoryDialog } from '../../shared/category-dialog/category-dialog';
import { MatIcon } from "@angular/material/icon";
import { DatePipe } from '@angular/common';
import { ResultService } from '../../core/services/result.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-categories',
  imports: [MatIcon, DatePipe],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  constructor(
    private localCategoryService: LocalCategoryService,
    private categoryDialog: MatDialog,
    private route: Router,
    private authService: LocalAuthService,
    private toastr: ToastService
  ) {
    effect(() => {
      this.authService.user$.subscribe((u) => this.userId = u?.id!);
    });
  }

  userId: string = '';
  categories: Category[] = [];
  category: Category | null = null;

  repetitiveStyles = {
    validationErrorText: 'text-red-500 text-sm mt-1'
  };

  isModalOpen = false;
  eventType: 'create' | 'update' = 'create';

  ngOnInit() {
    this.categories = this.localCategoryService.getAll().data ?? [];
    this.category = this.defaultCategory();
  }

  refetch() {
    this.categories = this.localCategoryService.getAll().data ?? [];
  }

  openModal(event: 'create' | 'update' = 'create') {
    const dialogRef = event === 'create'
      ? this.categoryDialog.open(CategoryDialog, { data: { formData: null, action: event }, autoFocus: false })
      : this.categoryDialog.open(CategoryDialog, { data: { formData: this.category, action: event }, autoFocus: false });

    dialogRef.afterClosed().subscribe((data: Category | undefined) => {
      if (data) {
        let res;
        if (event === 'create') {
          res = this.localCategoryService.create(data);
        } else {
          res = this.localCategoryService.update(data);
        }
        if (res && res.isSuccess) {
          this.refetch();
          this.toastr.success(res.message);
        }
        else {
          this.toastr.error(res.message)
        }
      }
    });
  }

  editCategory(id: string) {
    const existing = this.localCategoryService.getById(id).data;
    this.category = existing ?? this.defaultCategory();
    this.openModal('update');
  }

  deleteCategoryById(id: string) {
    const res = this.localCategoryService.deleteById(id);
    this.refetch();
    this.toastr.success(res.message);
  }

  viewCategory(id: string) {
    this.route.navigate([`/category/${id}`]);
  }

  defaultCategory(): Category {
    return {
      id: '',
      name: '',
      description: '',
      // isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  formatId(id: string) {
    return id.replace(/\D/g, '').slice(0, 8);
  }
}

