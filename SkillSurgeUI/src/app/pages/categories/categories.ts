import { Component, effect } from '@angular/core';
import { LocalCategoryService } from '../../core/services/localcategory.service';
import { Category } from '../../core/models/interfaces/Category';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalAuthService } from '../../core/services/localauth.service';
import { CategoryDialog } from '../../shared/category-dialog/category-dialog';
import { MatIcon } from "@angular/material/icon";
import { DatePipe } from '@angular/common';
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
  activeCategories: Category[] = [];
  deletedCategories: Category[] = [];
  category: Category | null = null;

  repetitiveStyles = {
    validationErrorText: 'text-red-500 text-sm mt-1'
  };

  isModalOpen = false;
  eventType: 'create' | 'update' = 'create';

  ngOnInit() {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data.data ?? [];
      this.activeCategories = this.categories.filter(c => !c.isDeleted);
      this.deletedCategories = this.categories.filter(c => c.isDeleted || c.deletedSubCategoriesCount! > 0 );
    });
    this.category = this.defaultCategory();
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
            description: data.description,
          }
          if (data.parentCategoryId) payload.parentCategoryId = data.parentCategoryId
          this.categoryService.createCategory(payload).subscribe({
            next: (res) => {
              console.log(res);
              if (res.success) {
                this.ngOnInit();
                this.toastr.success(res.message)
              }
            }
          })
        } else {
          const payload: UpdateCategoryRequest = {
            name: data?.name,
            description: data.description
          }
          if (data.parentCategoryId) payload.parentCategoryId = data.parentCategoryId
          this.categoryService.updateCategory(data.id, payload).subscribe({
            next: (res) => {
              console.log(res);
              if (res.success) {
                this.ngOnInit();
                this.toastr.success(res.message)
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
        this.ngOnInit();
        this.toastr.success(data.message);
      }
    });
  }

  restoreCategoryById(id: string, restoreAll: boolean = false) {
    this.categoryService.restoreCategory(id, restoreAll).subscribe((data) => {
      if (data && data.success) {
        this.ngOnInit();
        this.toastr.success(data.message);
      }
    });
  }

  toggleSubCategories(category: Category) {

    // collapse
    if (category.isActiveExpanded) {
      category.isActiveExpanded = false;
      return;
    }

    // already loaded
    if (category.activeSubCategories?.length) {
      category.isActiveExpanded = true;
      return;
    }

    // load from API
    this.categoryService.getSubCategories(category.id).subscribe(res => {

      if(res.success && res.data){
        category.activeSubCategories = res.data.filter(s => !s.isDeleted);
        category.isActiveExpanded = true;
      }

    });
  }
  
  toggleDeletedSubCategories(category: Category) {

    // collapse
    if (category.isDeletedExpanded) {
      category.isDeletedExpanded = false;
      return;
    }

    // already loaded
    if (category.deletedSubCategories?.length) {
      category.isDeletedExpanded = true;
      return;
    }

    // load from API
    this.categoryService.getDeletedSubCategories(category.id).subscribe(res => {

      category.deletedSubCategories = res.data;
      category.isDeletedExpanded = true;

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
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  formatId(id: string) {
    return id.replace(/\D/g, '').slice(0, 8);
  }
  
  isActiveTab=true;
  toggleTabs(check: boolean){
    this.isActiveTab = check;
  }
}

