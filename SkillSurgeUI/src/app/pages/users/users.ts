import { Component } from '@angular/core';
import { User } from '../../core/models/interfaces/User';
import { UserService } from '../../core/services/user.service';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../../shared/user-dialog/user-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-users',
  imports: [MatIcon, DatePipe, NgSelectModule, CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastService
  ) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data.data!;
    });
  }

  editUser(id: string) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: { user: this.users.find((u) => u.id === id) },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.updateUserRole(result.id, { roleId: result.role }).subscribe(
          {
            next: res => {
              if (res.success) {
                this.ngOnInit();
                this.toastr.success(res.message)
              }
              this.toastr.error(res.message)
            },
            error: err => {
              this.toastr.error(err.error?.message)
            }
          });
      }
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.ngOnInit();
      });
    }
  }

  updateStatus(user: any) {
    this.userService.updateUserStatus(user.id, { isActive: !user.isActive }).subscribe({
      next: (res) => {
        this.ngOnInit();
        this.toastr.success(res.message);
      },
      error: (err) => {
        if (err.status === 403) {
          this.toastr.success('You do not have permission to update user status');
          this.ngOnInit();
        }
        else {
          this.toastr.error(err.error?.message || 'Failed to update user status');
        }
        this.ngOnInit();
      }
    });
  }
}
