import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanCreationService } from '../loan-creation.service';
import { MysqlDatePipe } from '../mysql-date.pipe';

@Component({
  selector: 'app-loancreation',
  imports: [CommonModule,FormsModule , MysqlDatePipe ],
  templateUrl: './loancreation.component.html',
  styleUrl: './loancreation.component.css'
})

export class LoancreationComponent {
  
  LoanTable : any = [];
  schedule : any = [];
  periodUnit : any = [
    { value : "year" , Title : "Year"},
    { value : "month" , Title : "Month"},
    { value : "week" , Title : "Week"},
    { value : "day" , Title : "Day"},
  ]
  calculationType : any = [
    { value : "flat" , Title : "Flat"},
    { value : "reducing" , Title : "Reducing"},
    { value : "interest-only" , Title : "Interest Only"},
    { value : "rule78" , Title : "Rule 78"},
    { value : "balloon" , Title : "Balloon"},
  ];

  constructor(private emiService: LoanCreationService){

  }

  LoanForm:any = {
    LoanAmount : 0 ,
    Tenure : 0 ,
    TenureType : "month" ,
    RateOfInterest : 0 ,
    RateOfInterestType : "year" ,
    CalculationType : "flat" ,
    balloonPayment : 2 ,
    LoanDate : new Date().toISOString().slice(0,10),
    EMIDate : new Date().toISOString().slice(0,10)
  }

  SubmitData(){
    
    var obj = {
      loanAmount: Number(this.LoanForm.LoanAmount),
      tenureValue: Number(this.LoanForm.Tenure),
      tenureUnit:  this.LoanForm.TenureType , //'year' | 'month' | 'week' | 'day';
      interestRateValue: Number(this.LoanForm.RateOfInterest),
      interestUnit: this.LoanForm.RateOfInterestType, //'year' | 'month' | 'week' | 'day';
      method: this.LoanForm.CalculationType , //| 'flat' | 'interest-only' | 'rule78' | 'balloon';
      balloonPayment : 2 ,
      EmiStartDate : this.LoanForm.EMIDate
    }
    
    // this.schedule = this.emiService.calculateEMISchedule({
    //   loanAmount: 50000,
    //   tenureValue: 12,
    //   tenureUnit:  'month' , //'year' | 'month' | 'week' | 'day';
    //   interestRateValue: 3,
    //   interestUnit: 'month', //'year' | 'month' | 'week' | 'day';
    //   method: 'reducing' , //| 'flat' | 'interest-only' | 'rule78' | 'balloon';
    //   balloonPayment : 2
    // });
    this.schedule = this.emiService.calculateEMISchedule(obj);

    console.log(this.schedule);
  }
}
