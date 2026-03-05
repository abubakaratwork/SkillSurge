export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    agreeTerms: boolean,
    role: RoleTypes
}

export enum RoleTypes {
    admin = 'admin',
    user = 'user'
}