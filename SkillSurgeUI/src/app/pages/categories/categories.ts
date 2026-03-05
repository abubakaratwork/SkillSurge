import { Component } from '@angular/core';
import { LocalCategoryService } from '../../core/services/localcategory.service';
import { Category } from '../../core/models/interfaces/Category';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  constructor(private categoryService: LocalCategoryService) { }

  categories: Category[] = [];

  ngOnInit() {
    this.categories = this.categoryService.getAll();
  }
}
