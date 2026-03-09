import { Component } from '@angular/core';
import { User } from '../../core/models/interfaces/User';
import { UserService } from '../../core/services/user.service';
import { MatIcon } from "@angular/material/icon";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [MatIcon, DatePipe],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data.data!
    })
  }

  editUser(id: string) {

  }

  deleteUser(id: string) {

  }
}
