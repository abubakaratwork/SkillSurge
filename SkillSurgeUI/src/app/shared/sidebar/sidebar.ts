import { Component, effect, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { NgClass, TitleCasePipe } from '@angular/common';
import { LocalAuthService } from '../../core/services/localauth.service';
import { RoleTypes, User } from '../../core/models/interfaces/User';
import { ToastService } from '../../core/services/toast.service';

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

  constructor(private authService: LocalAuthService, private router: Router, private toastr: ToastService) {
    effect(() => {
      this.authService.user$.subscribe((u) => {
        this.userName = `${u?.firstName} ${u?.lastName}`
        this.email = u?.email!;
      });
    })
  }

  ngOnInit() {
    // if (this.authService.user()?.role == RoleTypes.admin) {
    //   this.navItems.push({ label: 'Categories', link: '/categories', icon: 'category' })
    // }
    // this.navItems.push({ label: 'Profile', link: '/profile', icon: 'person' })
  }


  logout() {
    const res = this.authService.logout();
    this.router.navigate(['/login']);
    this.toastr.success(res.message);
  }
}
