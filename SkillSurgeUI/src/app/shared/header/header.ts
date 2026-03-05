import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLink, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  isAuthenticated = true;

  constructor(private router: Router) {}

 logout() {
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
