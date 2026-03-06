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

@Component({
  selector: 'app-profile',
  imports: [FormsModule, TitleCasePipe, MatIcon],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeTerms: false,
    role: RoleTypes.user
  };


  constructor(private authService: LocalAuthService, private router: Router, private dialog: MatDialog, private toastr: ToastService) {
    effect(() => {
      this.authService.user$.subscribe((u) => this.user = u!);
    });
  }

  editInfo() {
    let dialogRef = this.dialog.open(UserInfoDialog, { data: { user: this.user } });

    dialogRef.afterClosed().subscribe((data: User | null) => {
      if (data) {
        const res = this.authService.updateUserInfo(data);
        if (res.isSuccess) {
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
      }
    })
  }

  changePassword() {
    let dialogRef = this.dialog.open(ChangePasswordDialog)

    dialogRef.afterClosed().subscribe((data: { currentPassword: string, newPassword: string }) => {
      if (data) {
        const res = this.authService.changePassword(data.currentPassword, data.newPassword);
        if (res.isSuccess) {
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
      }
    })
  }
}
