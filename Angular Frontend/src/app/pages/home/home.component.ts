import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'home-page',
  imports: [HeaderComponent],
  template: `
    <header-component></header-component>
    <h3>Client Server is working!</h3>
  `,
  styles: `
    h3
      margin-top: 20px
  `
})
export class HomePage {}
