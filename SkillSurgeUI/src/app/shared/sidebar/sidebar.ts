import { Component, effect, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { NgClass, TitleCasePipe } from '@angular/common';
import { User } from '../../core/models/interfaces/User';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, MatIcon, NgClass, RouterLinkActive, TitleCasePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() isCollapsed: boolean = false;
  @Input() navItems: any = false;

  user: User | null = null;
  isAdmin: boolean = false;
  userName: string = 'User name';
  email: string = 'user email';

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private toastr: ToastService) {
    effect(() => {
      this.userService.userProfile$.subscribe((u) => {
        this.userName = `${u?.firstName} ${u?.lastName}`
        this.email = u?.email!;
      });
    })
  }

  logout() {
    this.userService.logout().subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
        this.toastr.success(res.message || 'Logged out successfully.');
      },
      error: (error) => {
        this.userService.clearUserState();
        this.router.navigate(['/login']);
        this.toastr.error(error.error?.message || "Something went wrong. Please try again.");
      }
    });
  }
}
