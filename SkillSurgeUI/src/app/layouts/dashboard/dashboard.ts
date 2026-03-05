import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  sidebarCollapsed = false;
}
