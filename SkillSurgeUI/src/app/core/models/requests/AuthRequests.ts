export interface LoginRequest{
    email: string,
    password: string,
    rememberMe: boolean
}

export interface SignupRequest{
    firstName: string,   
    lastName: string,   
    email: string,   
    password: string,   
    isAgreedToTerms: boolean,   
}