import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserprofileComponent } from "./userprofile/userprofile.component";
import { HeaderComponent } from './header/header.component';
import { LoancreationComponent } from "./loancreation/loancreation.component";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserprofileComponent, HeaderComponent, LoancreationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LOS';
}
