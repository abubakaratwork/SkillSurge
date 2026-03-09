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
import { CategoryService } from '../../core/services/category.service';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../core/models/requests/CategoryRequests';

@Component({
  selector: 'app-categories',
  imports: [MatIcon, DatePipe],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  constructor(
    private localCategoryService: LocalCategoryService,
    private categoryService: CategoryService,
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
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data.data ?? []
    });
    this.category = this.defaultCategory();
  }

  refetch() {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data.data ?? []
    });
  }

  openModal(event: 'create' | 'update' = 'create', parentId?: string) {
    const dialogRef = event === 'create'
      ? this.categoryDialog.open(CategoryDialog, { data: { formData: null, action: event, parentId }, autoFocus: false })
      : this.categoryDialog.open(CategoryDialog, { data: { formData: this.category, action: event, parentId }, autoFocus: false });

    dialogRef.afterClosed().subscribe((data: Category | undefined) => {
      if (data) {
        if (event === 'create') {
          const payload: CreateCategoryRequest = {
            name: data?.name,
            isActive: data?.isActive,
            description: data.description,
          }
          if (data.parentCategoryId) payload.parentCategoryId = data.parentCategoryId
          this.categoryService.createCategory(payload).subscribe({
            next: (res) => {
              console.log(res);
              if (res.success) {
                this.toastr.success(res.message)
                this.refetch();
              }
            }
          })
        } else {
          const payload: UpdateCategoryRequest = {
            name: data?.name,
            isActive: data?.isActive,
            description: data.description
          }
          if (data.parentCategoryId) payload.parentCategoryId = data.parentCategoryId
          this.categoryService.updateCategory(data.id, payload).subscribe({
            next: (res) => {
              console.log(res);
              if (res.success) {
                this.toastr.success(res.message)
                this.refetch();
              }
            }
          })
        }
      }
    });
  }

  addCategory() {
    this.openModal('create');
  }

  editCategory(id: string, parentCategoryId?: string) {
    this.categoryService.getById(id).subscribe((data) => {
      this.category = data.data ?? this.defaultCategory();

      if (parentCategoryId) {
        this.openModal('update', parentCategoryId);
      } else {
        this.openModal('update');
      }
    });
  }

  addSubCategory(parentId: string) {
    this.openModal('create', parentId);
  }

  deleteCategoryById(id: string) {
    this.categoryService.deleteCategory(id).subscribe((data) => {
      if (data && data.success) {
        this.refetch();
        this.toastr.success(data.message);
      }
    });
  }

  toggleSubCategories(category: Category) {

    // collapse
    if (category.isExpanded) {
      category.isExpanded = false;
      return;
    }

    // already loaded
    if (category.subCategories?.length) {
      category.isExpanded = true;
      return;
    }

    // load from API
    this.categoryService.getSubCategories(category.id).subscribe(res => {

      category.subCategories = res.data;
      category.isExpanded = true;

    });

  }

  viewCategory(id: string) {
    this.route.navigate([`/category/${id}`]);
  }

  defaultCategory(): Category {
    return {
      id: '',
      name: '',
      description: '',
      parentCategoryId: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  formatId(id: string) {
    return id.replace(/\D/g, '').slice(0, 8);
  }
}

