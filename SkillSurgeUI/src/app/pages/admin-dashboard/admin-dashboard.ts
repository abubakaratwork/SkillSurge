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

  totalUsers = 3;
  totalProducts = 3;
  totalCategories = 3;
  totalSubCategories = 3;
}
