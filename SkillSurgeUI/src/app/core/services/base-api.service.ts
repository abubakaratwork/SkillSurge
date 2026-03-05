import { Injectable } from "@angular/core";
import { environment } from "../env/environment"

@Injectable({
    providedIn: "root"
})
export class BaseApiService {
    get baseApiUrl(): string {
        return environment.apiBaseUrl;
    }
}