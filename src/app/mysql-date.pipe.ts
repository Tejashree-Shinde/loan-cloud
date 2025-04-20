import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mysqlDate'
})
export class MysqlDatePipe implements PipeTransform {

  transform(value: Date | string, format: string): string {
    
    const date = value instanceof Date ? value : new Date(value);
    const map: { [key: string]: string } = {
      '%Y': date.getFullYear().toString(),
      '%y': date.getFullYear().toString().slice(-2),
      '%m': String(date.getMonth() + 1).padStart(2, '0'),
      '%d': String(date.getDate()).padStart(2, '0'),
      '%b': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()],
      '%H': String(date.getHours()).padStart(2, '0'),
      '%i': String(date.getMinutes()).padStart(2, '0'),
      '%s': String(date.getSeconds()).padStart(2, '0'),
    };

    return format.replace(/%[YymdbHis]/g, match => map[match] || match);
  }
}

