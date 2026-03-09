import { Component, Inject } from '@angular/core';
import { RoleTypes, User } from '../../core/models/interfaces/User';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user-dialog',
  imports: [FormsModule, NgSelectModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent {

  user: User;

  roles = [];

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: { user: User },
    private userService: UserService
  ) {
    this.user = { ...dialogData.user }; // clone to avoid direct mutation
  }

  ngOnInit(){
     this.userService.getAllRoles().subscribe((data) => {
      this.roles = data.data!;
    });
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
