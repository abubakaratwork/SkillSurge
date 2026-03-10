export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    agreeTerms: boolean,
    role: string,
    isActive: string,
    lastLoginAt: Date,
    createdAt: Date,
    updatedAt: Date,
}

export enum RoleTypes {
    admin = 'admin',
    superAdmin = 'superAdmin',
    user = 'user',
}