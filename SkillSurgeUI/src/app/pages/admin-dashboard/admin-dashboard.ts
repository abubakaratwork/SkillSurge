import { Component, effect } from '@angular/core';
import { Category } from '../../core/models/interfaces/Category';
import { SubCategory } from '../../core/models/interfaces/SubCategory';
import { LocalCategoryService } from '../../core/services/localcategory.service';
import { LocalSubCategoryService } from '../../core/services/localsubcategory.service';
import { MatDialog } from '@angular/material/dialog';
import { LocalAuthService } from '../../core/services/localauth.service';
import { Router } from '@angular/router';
import { CategoryDialog } from '../../shared/category-dialog/category-dialog';
import { SubCategoryDialog } from '../../shared/sub-category-dialog/sub-category-dialog';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatIcon, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  expandedCategories: string[] = [];
  userId: string = '';

  constructor(
    private categoryService: LocalCategoryService,
    private subCategoryService: LocalSubCategoryService,
    private dialog: MatDialog,
    private authService: LocalAuthService,
    private route: Router
  ) {
    effect(() => {
      this.authService.user$.subscribe((u) => this.userId = u?.id!);
    });
  }

  ngOnInit() {
    this.categories = this.categoryService.getAll().data ?? [];
    this.subCategories = this.subCategoryService.getAll().data ?? [];
  }

  toggleSubCategories(categoryId: string) {
    if (this.expandedCategories.includes(categoryId)) {
      this.expandedCategories = this.expandedCategories.filter(id => id !== categoryId);
    } else {
      this.expandedCategories.push(categoryId);
    }
  }

  getSubCategories(categoryId: string): SubCategory[] {
    return this.subCategories.filter(sub => sub.categoryId === categoryId);
  }

  openCategoryModal(event: 'create' | 'update' = 'create', category?: Category) {
    const dialogRef = this.dialog.open(CategoryDialog, { data: { formData: category ?? null, action: event }, autoFocus: false });
    dialogRef.afterClosed().subscribe((data: Category | undefined) => {
      if (data) {
        if (event === 'create') this.categoryService.create(data);
        else this.categoryService.update(data);
        this.refreshData();
      }
    });
  }

  editCategory(id: string) {
    const category = this.categories.find(c => c.id === id);
    if (category) this.openCategoryModal('update', category);
  }

  deleteCategoryById(id: string) {
    this.categoryService.deleteById(id);
    this.refreshData();
    alert(`Category deleted: ${id}`);
  }

  editSubCategory(id: string) {
    const sub = this.subCategories.find(s => s.id === id);
    if (sub) {
      const dialogRef = this.dialog.open(SubCategoryDialog, { data: { formData: sub, action: 'update' }, autoFocus: false });
      dialogRef.afterClosed().subscribe((data: SubCategory | undefined) => {
        if (data) {
          this.subCategoryService.update(data);
          this.refreshData();
        }
      });
    }
  }

  deleteSubCategoryById(id: string) {
    this.subCategoryService.deleteById(id);
    this.refreshData();
    alert(`SubCategory deleted: ${id}`);
  }

  refreshData() {
    this.categories = this.categoryService.getAll().data ?? [];
    this.subCategories = this.subCategoryService.getAll().data ?? [];
  }
}
