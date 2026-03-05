import { Injectable } from "@angular/core";

export interface User {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    agreeTerms: boolean,
}

@Injectable({
    providedIn: "root"
})
export class LocalAuthService{
    signup(data : any) {
        const item : string | null = localStorage.getItem("users");
        let users : User[] = item ? JSON.parse(item) : [];

        users.push(data);

        localStorage.setItem("users", JSON.stringify(users))
    }

    login(email: string, password: string) : boolean {
        const item : string | null = localStorage.getItem("users");
        let users : User[] = item ? JSON.parse(item) : [];

        const user = users.find(val => val.email == email && val.password == password)

        if (user?.email) return true;

        return false;
    }
};