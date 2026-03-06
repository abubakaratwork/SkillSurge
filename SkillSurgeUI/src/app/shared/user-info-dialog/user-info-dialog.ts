import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleTypes, User } from '../../core/models/interfaces/User'

@Component({
  selector: 'app-user-info-dialog',
  imports: [FormsModule],
  templateUrl: './user-info-dialog.html',
  styleUrl: './user-info-dialog.css',
})
export class UserInfoDialog {

  user: User;

  roles = [
    { value: RoleTypes.user, label: 'User' },
    { value: RoleTypes.admin, label: 'Admin' }
  ];

  constructor(
    private dialogRef: MatDialogRef<UserInfoDialog>,
    @Inject(MAT_DIALOG_DATA) private dialogData: { user: User }
  ) {
    this.user = { ...dialogData.user }; // clone to avoid direct mutation
  }

  submitForm(profileForm: NgForm) {
    if (profileForm.invalid) {
      Object.values(profileForm.controls).forEach(c => c.markAsTouched());
      return;
    }
    this.dialogRef.close(this.user);
  }

  close() {
    this.dialogRef.close();
  }
}
