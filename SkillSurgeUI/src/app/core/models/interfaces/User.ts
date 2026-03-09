export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    agreeTerms: boolean,
    role: RoleTypes,
    lastLoginAt: Date,
    createdAt: Date,
    updatedAt: Date,
}

export enum RoleTypes {
    admin = 'admin',
    user = 'user'
}