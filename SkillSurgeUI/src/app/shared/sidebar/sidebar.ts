import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { NgClass } from '@angular/common';
import { LocalAuthService } from '../../core/services/localauth.service';
import { RoleTypes } from '../../core/models/interfaces/User';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, MatIcon, NgClass, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() isCollapsed: boolean = false;

  isAdmin: boolean = false;

  constructor(private authService: LocalAuthService) { }

  navItems = [
    { label: 'Dashboard', link: '/home', icon: 'dashboard' },
    // { label: 'Products', link: '/products', icon: 'inventory_2' },
    // { label: 'Categories', link: '/categories', icon: 'category' },
    // { label: 'Profile', link: '/profile', icon: 'person' },
  ];

  ngOnInit() {
    if (this.authService.user()?.role == RoleTypes.admin) {
      this.navItems.push({ label: 'Categories', link: '/categories', icon: 'category' })
    }
    // this.navItems.push({ label: 'Profile', link: '/profile', icon: 'person' })
  }
}
