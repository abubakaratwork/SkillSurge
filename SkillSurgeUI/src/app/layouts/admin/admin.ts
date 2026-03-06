import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  sidebarCollapsed = false;

  headerNavLink = {
    label: "Go to Home",
    link: "/home"
  }

  sidebarNavItems = [
    { label: 'Dashboard', link: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Categories', link: '/admin/categories', icon: 'category' },
    { label: 'Sub Categories', link: '/admin/sub-categories', icon: 'inventory_2' },
  ];
}
