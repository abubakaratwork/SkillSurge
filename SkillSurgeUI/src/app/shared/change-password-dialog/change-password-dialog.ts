import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password-dialog',
  imports: [FormsModule],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.css',
})
export class ChangePasswordDialog {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private dialogRef: MatDialogRef<ChangePasswordDialog>) { }

  submitForm(form: NgForm) {
    if (form.invalid || this.newPassword !== this.confirmPassword) {
      Object.values(form.controls).forEach(c => c.markAsTouched());
      return;
    }

    // You can call a service here to update password
    this.dialogRef.close({ currentPassword: this.currentPassword, newPassword: this.newPassword });
  }

  close() {
    this.dialogRef.close();
  }
}
