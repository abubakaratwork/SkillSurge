import { Injectable, signal, WritableSignal } from "@angular/core";
import { User } from "../models/interfaces/User";

@Injectable({
    providedIn: "root"
})
export class LocalAuthService {
    private loggedInUserKey: string = "loggedInUser";
    private usersKey: string = "users";

    user : WritableSignal<User | null> = signal(this.getUserInfo());

    private getAll(): User[] {
        const item: string | null = localStorage.getItem(this.usersKey);
        let users: User[] = item ? JSON.parse(item) : [];

        return users;
    }

    signup(data: User) {
        let users: User[] = this.getAll();

        if (users.find(u => u.email == data.email))
            return;

        users.push(data);

        localStorage.setItem(this.usersKey, JSON.stringify(users))
    }

    login(email: string, password: string): boolean {
        let users: User[] = this.getAll();

        const user = users.find(val => val.email == email && val.password == password)

        if (user?.email) {
            localStorage.setItem(this.loggedInUserKey, JSON.stringify(user))
            this.user.set(user);
            return true;
        }

        return false;
    }

    isLoggedIn() {
        const user = localStorage.getItem(this.loggedInUserKey);

        if (user) return true;

        return false;
    }

    logout() {
        localStorage.removeItem(this.loggedInUserKey);
        this.user.set(null);
    }

    getUserInfo() : User | null{
        const user = localStorage.getItem(this.loggedInUserKey);

        if (user) return JSON.parse(user);

        return null;
    }
};