import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pop-up-modal',
  imports: [CommonModule],
  templateUrl: './pop-up-modal.component.html',
  styleUrl: './pop-up-modal.component.css'
})
export class PopUpModalComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
