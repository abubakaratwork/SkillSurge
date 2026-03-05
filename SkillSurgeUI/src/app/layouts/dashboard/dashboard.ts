import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
