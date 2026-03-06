import { Injectable } from "@angular/core";
import { Currency } from "../models/interfaces/Currency";

@Injectable({
    providedIn: 'root'
})
export class LocalCurrencyService {
    getAll(): Currency[] {
        const json = localStorage.getItem('currencies');
        const currencies: Currency[] = json ? JSON.parse(json) : [];

        return currencies
            .filter(c => c.currencyCode && c.currencyCode.trim() !== '')
            .map(c => ({
                ...c,
                currencyCode: c.currencyCode.length > 3
                    ? c.currencyCode.slice(0, 3)
                    : c.currencyCode
            }));
    }
}