import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormsModule } from '@angular/forms';


@Component({
  selector: 'app-userprofile',
  imports: [FormsModule,CommonModule],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})

export class UserprofileComponent {

  UserArr: any = [];

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem("DataArr");
      this.UserArr = data ? JSON.parse(data) : [];
    }
  }
  UserForm: any = {
    FirstName: '',
    MiddleName: '',
    LastName : '',
    Email : '',
    DateOfBirth : new Date().toISOString().slice(0,10),    
    Country :'',    
    City :'',    
    State :'',    
    ZipCode :'',   
    StreetAddress : '',
    Field : '',
    Designation : '',
    CompanyAddress : '',
    Company : '',
    Income : '',
    Image : ''
  };
  
  

  documents: any = {
    idProof: null,
    incomeProof: null,
    addressProof: null,
    photo: null
  };

  onFileChange(event: any, docType: string) {
    if (event.target.files.length > 0) {
      this.documents[docType] = event.target.files[0];
    }
  }
  imagePreview: string | ArrayBuffer | null = null;

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  SubmitData(){
    console.log(this.UserArr);

    this.UserForm.Image = this.imagePreview;
    var item =  JSON.parse(JSON.stringify(this.UserForm));
    this.UserArr.push(item);
    localStorage.setItem("DataArr" , JSON.stringify(this.UserArr));
  }
  onSubmit() {
    console.log('Borrower Info:', this.UserForm);
    // console.log('Uploaded Docs:', this.documents);
    // You will call API here to save borrower and upload files
  }
}
