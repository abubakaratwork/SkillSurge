import { Injectable, signal, WritableSignal } from "@angular/core";
import { User } from "../models/interfaces/User";
import { BehaviorSubject, Observable } from "rxjs";
import { ResultService } from "./result.service";
import { ResponseType } from "../models/responses/ResponseType";

@Injectable({
    providedIn: "root"
})
export class LocalAuthService {
    private loggedInUserKey: string = "loggedInUser";
    private usersKey: string = "users";

    constructor(private result: ResultService) { }

    private _userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(this.getUserInfo());
    public user$: Observable<User | null> = this._userSubject.asObservable();

    private getAll(): User[] {
        const item: string | null = localStorage.getItem(this.usersKey);
        let users: User[] = item ? JSON.parse(item) : [];

        return users;
    }

    signup(data: User): ResponseType<boolean> {
        const users = this.getAll();
        if (users.find(u => u.email === data.email)) {
            return this.result.failure<boolean>("Email already exists.");
        }

        users.push(data);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        return this.result.success<boolean>(true, "Signup successful.");
    }

    login(email: string, password: string): ResponseType<boolean> {
        const users = this.getAll();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
            this._userSubject.next(user);
            return this.result.success<boolean>(true, "Logged in successfully.");
        }

        return this.result.failure<boolean>("Invalid email or password.");
    }

    isLoggedIn() {
        const user = localStorage.getItem(this.loggedInUserKey);
        if (user) return true;
        return false;
    }

    logout(): ResponseType<boolean> {
        localStorage.removeItem(this.loggedInUserKey);
        this._userSubject.next(null);

        return this.result.success<boolean>(true, "Logged out successfully.")
    }

    getUserInfo(): User | null {
        const user = localStorage.getItem(this.loggedInUserKey);
        return user ? JSON.parse(user) : null;
    }

    updateUserInfo(data: User): ResponseType<boolean> {
        const loggedInUserJson = localStorage.getItem(this.loggedInUserKey);
        const usersJson = localStorage.getItem(this.usersKey);

        if (!loggedInUserJson || !usersJson)
            return this.result.failure<boolean>("User data not found.");

        const loggedInUser: User = JSON.parse(loggedInUserJson);
        let users: User[] = JSON.parse(usersJson);

        const userIndex = users.findIndex(u => u.id === loggedInUser.id);
        if (userIndex === -1)
            return this.result.failure<boolean>("User not found.");

        const updatedUser: User = {
            ...users[userIndex],
            firstName: data.firstName,
            lastName: data.lastName
        };

        users[userIndex] = updatedUser;

        localStorage.setItem(this.loggedInUserKey, JSON.stringify(updatedUser));
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        this._userSubject.next(updatedUser);

        return this.result.success<boolean>(true, "User info updated successfully.")
    }

    changePassword(currentPassword: string, newPassword: string): ResponseType<boolean> {
        const loggedInUserJson = localStorage.getItem(this.loggedInUserKey);
        const usersJson = localStorage.getItem(this.usersKey);

        if (!loggedInUserJson || !usersJson)
            return this.result.failure<boolean>("User data not found.");

        const loggedInUser: User = JSON.parse(loggedInUserJson);
        let users: User[] = JSON.parse(usersJson);

        const userIndex = users.findIndex(u => u.id === loggedInUser.id);
        if (userIndex === -1)
            return this.result.failure<boolean>("User not found.");

        if (users[userIndex].password != currentPassword)
            return this.result.failure<boolean>("Invalid current password.");

        const updatedUser: User = {
            ...users[userIndex],
            password: newPassword
        };

        users[userIndex] = updatedUser;

        localStorage.setItem(this.loggedInUserKey, JSON.stringify(updatedUser));
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        this._userSubject.next(updatedUser);

        return this.result.success<boolean>(true, "Password changed successfully.")
    }
};