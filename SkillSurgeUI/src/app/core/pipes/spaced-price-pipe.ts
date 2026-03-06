import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spacedPrice',
  pure: true,
  standalone: true
})
export class SpacedPricePipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe('en-US');

  transform(value: number | string, code: string = 'USD'): string | null {
    if (value == null) return null;

    const formatted = this.currencyPipe.transform(value, code, 'symbol', '1.0-0');
    if (!formatted) return null;

    const match = formatted.match(/^([^0-9]+)([0-9].*)$/);

    if (match) {
      const prefix = match[1].trim();
      const amount = match[2]; 

      return prefix.length >= 3 ? `${prefix} ${amount}` : `${prefix}${amount}`;
    }

    return formatted;
  }
}