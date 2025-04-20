import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  Yo : boolean = false;
  ShowHeader:any = {
    List : false
  };

  DisplayHeaders(event:Event){
    if(this.ShowHeader.List){
      this.ShowHeader.List = false
    }else{
      this.ShowHeader.List = true
    }
  }
}
