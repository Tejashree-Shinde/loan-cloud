import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoancreationComponent } from '../loancreation/loancreation.component';
import {PopUpModalComponent} from '../reusable/pop-up-modal/pop-up-modal.component';
import { UserprofileComponent } from "../userprofile/userprofile.component";

@Component({
  selector: 'app-header',
  imports: [CommonModule, LoancreationComponent, PopUpModalComponent, UserprofileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  


  showModal = false;

  modalState = {
    visible: false,
    content: '' as 'loanCreation' | 'userProfile' | ''
  };

  // This method opens modal with different content
  openModal(contentType: 'loanCreation' |  'userProfile') {
    this.modalState.visible = true;
    this.modalState.content = contentType;
  }

  // This method closes the modal
  closeModal() {
    this.modalState.visible = false;
    this.modalState.content = '';
  }

  Yo : boolean = false;
  ShowHeader:any = {
    List : false
  };

  ShowMainHeader:any = {
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
