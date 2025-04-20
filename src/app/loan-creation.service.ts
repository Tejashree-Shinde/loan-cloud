import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoanCreationService {
  constructor() {}

  

  calculateEMISchedule(options: {
    loanAmount: number;
    tenureValue: number;
    tenureUnit: 'year' | 'month' | 'week' | 'day';
    interestRateValue: number;
    interestUnit: 'year' | 'month' | 'week' | 'day';
    method: 'reducing' | 'flat' | 'interest-only' | 'rule78' | 'balloon';
    balloonPayment?: number;
    EmiStartDate ?: Date ;
  }): any[] {
    const methods: any = {
      reducing: this.calculateReducingEMI,
      flat: this.calculateFlatEMI,
      'interest-only': this.calculateInterestOnlyEMI,
      rule78: this.calculateRuleOf78EMI,
      balloon: this.calculateBalloonEMI,
    };

    const methodFunc = methods[options.method];
    if (!methodFunc) throw new Error('Invalid EMI calculation method');

    return methodFunc.call(this, options);
  }

  // --- Reducing Balance ---
  private calculateReducingEMI({ loanAmount, tenureValue, tenureUnit, interestRateValue, interestUnit , EmiStartDate }: any): any[] {
    const months = this.convertToMonths(tenureValue, tenureUnit);
    const rate = this.convertToMonthlyRate(interestRateValue, interestUnit);
    const emi = this.getReducingEMI(loanAmount, rate, months);

    let balance = loanAmount;
    const schedule = [];

    for (let i = 1; i <= months; i++) {
      const emiDate = this.incrementDate(EmiStartDate, i - 1, tenureUnit);

      const interest = balance * rate;
      const principal = emi - interest;
      balance -= principal;

      schedule.push({
        month: i,
        principal: this.round(principal),
        interest: this.round(interest),
        emi: this.round(emi),
        balance: this.round(Math.max(balance, 0)),
        EmiDate : emiDate
      });
    }

    return schedule;
  }

  // --- Flat Rate ---
  private calculateFlatEMI({ loanAmount, tenureValue, tenureUnit, interestRateValue, interestUnit , EmiStartDate }: any): any[] {
    const months = this.convertToMonths(tenureValue, tenureUnit);
    const rate = this.convertToMonthlyRate(interestRateValue, interestUnit);

    const totalInterest = loanAmount * rate * months;
    const emi = (loanAmount + totalInterest) / months;
    const principal = loanAmount / months;
    const interest = totalInterest / months;

    const schedule = [];
    for (let i = 1; i <= months; i++) {
      const emiDate = this.incrementDate(EmiStartDate, i - 1, tenureUnit);
      schedule.push({
        month: i,
        principal: this.round(principal),
        interest: this.round(interest),
        emi: this.round(emi),
        balance: this.round(loanAmount - principal * i),
        EmiDate : emiDate
      });
    }

    return schedule;
  }

  // --- Interest Only ---
  private calculateInterestOnlyEMI({ loanAmount, tenureValue, tenureUnit, interestRateValue, interestUnit ,EmiStartDate }: any): any[] {
    const months = this.convertToMonths(tenureValue, tenureUnit);
    const rate = this.convertToMonthlyRate(interestRateValue, interestUnit);
    const interest = loanAmount * rate;

    const schedule = [];
    for (let i = 1; i <= months; i++) {
      const emiDate = this.incrementDate(EmiStartDate, i - 1, tenureUnit);
      schedule.push({
        month: i,
        principal: i === months ? this.round(loanAmount) : 0,
        interest: this.round(interest),
        emi: i === months ? this.round(loanAmount + interest) : this.round(interest),
        balance: i === months ? 0 : this.round(loanAmount),
        EmiStartDate : emiDate
      });
    }

    return schedule;
  }

  // --- Rule of 78 ---
  private calculateRuleOf78EMI({ loanAmount, tenureValue, tenureUnit, interestRateValue, interestUnit ,EmiStartDate }: any): any[] {
    const months = this.convertToMonths(tenureValue, tenureUnit);
    const rate = this.convertToMonthlyRate(interestRateValue, interestUnit);
    const totalInterest = loanAmount * rate * months;
    const totalWeight = (months * (months + 1)) / 2;

    let remainingPrincipal = loanAmount;
    const schedule = [];

    for (let i = 1; i <= months; i++) {
      const emiDate = this.incrementDate(EmiStartDate, i - 1, tenureUnit);
      
      const weight = months - i + 1;
      const interest = (weight / totalWeight) * totalInterest;
      const principal = loanAmount / months;
      remainingPrincipal -= principal;

      schedule.push({
        month: i,
        principal: this.round(principal),
        interest: this.round(interest),
        emi: this.round(principal + interest),
        balance: this.round(Math.max(remainingPrincipal, 0)),
        EmiDate : emiDate
      });
    }

    return schedule;
  }

  // --- Balloon Payment ---
  private calculateBalloonEMI({ loanAmount, tenureValue, tenureUnit, interestRateValue, interestUnit, EmiStartDate , balloonPayment = 0 }: any): any[] {
    const months = this.convertToMonths(tenureValue, tenureUnit);
    const rate = this.convertToMonthlyRate(interestRateValue, interestUnit);
    const interest = loanAmount * rate;

    const principalWithoutBalloon = loanAmount - balloonPayment;
    const monthlyPrincipal = principalWithoutBalloon / (months - 1);
    const schedule = [];

    for (let i = 1; i <= months; i++) {
      const isBalloonMonth = i === months;
      const emiDate = this.incrementDate(EmiStartDate, i - 1, tenureUnit);

      schedule.push({
        month: i,
        principal: this.round(isBalloonMonth ? balloonPayment : monthlyPrincipal),
        interest: this.round(interest),
        emi: this.round((isBalloonMonth ? balloonPayment : monthlyPrincipal) + interest),
        balance: isBalloonMonth ? 0 : this.round(loanAmount - monthlyPrincipal * i),
        EmiStartDate : emiDate
      });
    }

    return schedule;
  }


  
  // --- Utility Functions ---
  private convertToMonths(value: number, unit: string): number {
    switch (unit) {
      case 'year': return value * 12;
      case 'month': return value;
      case 'week': return Math.ceil(value / 4.345);
      case 'day': return Math.ceil(value / 30);
      default: throw new Error('Invalid tenure unit');
    }
  }

  private convertToMonthlyRate(value: number, unit: string): number {
    switch (unit) {
      case 'year': return value / 12 / 100;
      case 'month': return value / 100;
      case 'week': return (value * 4.345) / 100;
      case 'day': return (value * 30) / 100;
      default: throw new Error('Invalid interest unit');
    }
  }

  private getReducingEMI(P: number, r: number, n: number): number {
    return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }

  private round(val: number): number {
    return parseFloat(val.toFixed(2));
  }

  private incrementDate(startDate: Date, step: number, unit: 'day' | 'week' | 'month' | 'year'): Date {
    const date = new Date(startDate);
  
    switch (unit) {
      case 'day':
        date.setDate(date.getDate() + step);
        break;
      case 'week':
        date.setDate(date.getDate() + 7 * step);
        break;
      case 'month':
        date.setMonth(date.getMonth() + step);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() + step);
        break;
      default:
        throw new Error('Invalid unit');
    }
  
    return date;
  }

  private formatDateLikeMySQL(date: Date, format: string): string {
    const map: { [key: string]: string } = {
      '%Y': date.getFullYear().toString(),
      '%y': date.getFullYear().toString().slice(-2),
      '%m': String(date.getMonth() + 1).padStart(2, '0'),
      '%c': (date.getMonth() + 1).toString(),
      '%d': String(date.getDate()).padStart(2, '0'),
      '%e': date.getDate().toString(),
      '%b': this.getMonthName(date.getMonth()), // Short month name
      '%M': this.getMonthFullName(date.getMonth()), // Full month name
      '%H': String(date.getHours()).padStart(2, '0'),
      '%i': String(date.getMinutes()).padStart(2, '0'),
      '%s': String(date.getSeconds()).padStart(2, '0')
    };
  
    return format.replace(/%[YymcdebMHis]/g, match => map[match] || match);
  }
  
  private getMonthName(index: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[index];
  }
  
  private getMonthFullName(index: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[index];
  }
  
  
}
