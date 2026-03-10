import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatIcon, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  constructor(private userService: UserService) { }

  totalUsers = 0;
  totalProducts = 0;
  totalCategories = 0;
  totalSubCategories = 0;

  ngOnInit(){
    this.userService.getAdminDashboard().subscribe(res => {
      const data = res.data;
      this.totalCategories = data.categoriesCount
      this.totalProducts = data.productsCount
      this.totalUsers = data.usersCount
      this.totalSubCategories = data.subCategoriesCount
    })
  }
}
