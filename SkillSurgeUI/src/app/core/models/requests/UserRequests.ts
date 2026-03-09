export interface UpdatePasswordRequest{
    currentPassword: string,
    newPassword: string,
}

export interface UpdateUserProfileRequest{
    firstName: string,
    lastName: string,
}

export interface UpdateUserRoleRequest{
    roleId: string,
}

export interface UpdateUserStatusRequest{
    isActive: boolean,
}