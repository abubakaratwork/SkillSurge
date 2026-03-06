import { Component, effect } from '@angular/core';
import { SubCategory } from '../../core/models/interfaces/SubCategory';
import { SubCategoryDialog } from '../../shared/sub-category-dialog/sub-category-dialog';
import { LocalAuthService } from '../../core/services/localauth.service';
import { LocalCategoryService } from '../../core/services/localcategory.service';
import { LocalSubCategoryService } from '../../core/services/localsubcategory.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Category } from '../../core/models/interfaces/Category';
import { MatIcon } from "@angular/material/icon";
import { DatePipe } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-sub-categories',
  imports: [MatIcon, DatePipe],
  templateUrl: './sub-categories.html',
  styleUrl: './sub-categories.css',
})
export class SubCategories {
  subCategories: SubCategory[] = [];
  categories: Category[] = [];
  subCategory: SubCategory | null = null;

  userId: string = '';

  constructor(
    private subCategoryService: LocalSubCategoryService,
    private categoryService: LocalCategoryService,
    private dialog: MatDialog,
    private route: Router,
    private authService: LocalAuthService,
    private toastr: ToastService
  ) {
    effect(() => {
      this.authService.user$.subscribe((u) => this.userId = u?.id!);
    });
  }

  ngOnInit() {
    this.subCategories = this.subCategoryService.getAll().data ?? [];
    this.categories = this.categoryService.getAll().data ?? [];
    this.subCategory = this.defaultSubCategory();
  }

  refetch() {
    this.subCategories = this.subCategoryService.getAll().data ?? [];
  }

  openSubCategoryModal(event: 'create' | 'update' = 'create') {
    const dialogRef = event === 'create'
      ? this.dialog.open(SubCategoryDialog, { data: { formData: null, action: event }, autoFocus: false })
      : this.dialog.open(SubCategoryDialog, { data: { formData: this.subCategory, action: event }, autoFocus: false });

    dialogRef.afterClosed().subscribe((data: SubCategory | undefined) => {
      if (data) {
        let res;
        if (event === 'create') {
          res = this.subCategoryService.create(data);
        } else {
          res = this.subCategoryService.update(data);
        }
        if (res && res.isSuccess) {
          this.toastr.success(res.message);
          this.refetch();
        }
        else {
          this.toastr.error(res.message)
        }
      }
    });
  }

  editSubCategory(id: string) {
    const existing = this.subCategoryService.getById(id).data;
    this.subCategory = existing ?? this.defaultSubCategory();
    this.openSubCategoryModal('update');
  }

  deleteSubCategoryById(id: string) {
    const res = this.subCategoryService.deleteById(id);
    this.refetch();
    this.toastr.success(res.message);
  }

  viewSubCategory(id: string) {
    this.route.navigate([`/subcategory/${id}`]);
  }

  defaultSubCategory(): SubCategory {
    return {
      id: '',
      name: '',
      categoryId: '',
      description: '',
      // isActive: true,
      createdAt: new Date(),
      udpatedAt: new Date()
    };
  }

  formatId(id: string) {
    return id.replace(/\D/g, '').slice(0, 8);
  }
}
