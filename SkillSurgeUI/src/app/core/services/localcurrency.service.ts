import { Injectable } from "@angular/core";
import { Currency } from "../models/interfaces/Currency";
import { HttpClient } from "@angular/common/http";

export interface ApiCurrency {
    key: string,
    value: string
};

@Injectable({
    providedIn: 'root'
})
export class LocalCurrencyService {
    constructor(private client: HttpClient) { }

    getCurrenciesFromAPI() {
        return this.client.get<ApiCurrency[]>("https://api.apyhub.com/data/dictionary/currency", {
            headers: {
                "apy-token": "APY0yhbwdmZvRUIm9BOxHr5ZSY5q4BIpPsHUJWvYnCvgtrYTZKddzY30vjCEu4n8BO",
                "content-type": "application/json"
            }
        })
    }

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