import { Injectable } from "@angular/core";
import { ResponseType } from "../models/responses/ResponseType";

@Injectable({
    providedIn: 'root'
})
export class ResultService {
    success<T>(data: T, message: string): ResponseType<T> {
        return {
            isSuccess: true,
            message: message,
            data: data
        }
    }

    failure<T>(message: string): ResponseType<T> {
        return {
            isSuccess: false,
            message: message,
            data: null as T
        }
    }
}