import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() navItem: any = null;

  isOnAdminDashboard: boolean = false;

  isAuthenticated: boolean = false;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isOnAdminDashboard = this.router.url.includes('/admin');
  }
}
