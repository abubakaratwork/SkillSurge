import { Component, effect } from '@angular/core';
import { LocalAuthService } from '../../core/services/localauth.service';
import { FormsModule } from '@angular/forms';
import { RoleTypes, User } from '../../core/models/interfaces/User';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoDialog } from '../../shared/user-info-dialog/user-info-dialog';
import { ChangePasswordDialog } from '../../shared/change-password-dialog/change-password-dialog';
import { ResponseType } from '../../core/models/responses/ResponseType';
import { ResultService } from '../../core/services/result.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile, UserService } from '../../core/services/user.service';
import { UpdatePasswordRequest, UpdateUserProfileRequest } from '../../core/models/requests/UserRequests';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, TitleCasePipe, MatIcon],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user: UserProfile = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  };


  constructor(private userService: UserService, private router: Router, private dialog: MatDialog, private toastr: ToastService) { }

  ngOnInit() {
    this.userService.userProfile$.subscribe((u) => this.user = u!);
  }

  editInfo() {
    let dialogRef = this.dialog.open(UserInfoDialog, { data: { user: this.user } });

    dialogRef.afterClosed().subscribe((data: User | null) => {
      if (data) {
        const updateRequest: UpdateUserProfileRequest = {
          firstName: data.firstName,
          lastName: data.lastName
        }
        this.userService.updateUserInfo(updateRequest).subscribe({
          next: res => {
            if (res.success) {
              this.toastr.success(res.message);
            }
          },
          error: err => {
            this.toastr.error(err.error?.message)
          }
        });
      }
    })
  }

  changePassword() {
    let dialogRef = this.dialog.open(ChangePasswordDialog)

    dialogRef.afterClosed().subscribe((data: { currentPassword: string, newPassword: string }) => {
      if (data) {
        const updateRequest: UpdatePasswordRequest = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }
        this.userService.changePassword(updateRequest).subscribe({
          next: res => {
            if (res.success) {
              this.toastr.success(res.message);
            }
          },
          error: err => {
            this.toastr.error(err.error?.message);
          }
        });
      }
    })
  }
}
