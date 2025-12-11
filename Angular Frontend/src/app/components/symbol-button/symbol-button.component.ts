import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'symbol-button',
  imports: [],
  template: `
    <p
      [style]="{
        width: size + 'px',
        height: size + 'px',
        fontSize: (iconSize ? iconSize : size*.5) + 'px',
        backgroundColor: color,
        borderWidth: size*.05 + 'px'
      }"
    >
      <ng-content></ng-content>
    </p>
  `,
  styles: `
    p 
      display: inline
      width: 40px
      height: 40px
      border-radius: 100%
      display: flex
      justify-content: center
      align-items: center
      background-color: var(--bs-secondary-bg)
      font-size: 20px
      font-weight: bold
      cursor: pointer

      &:hover
        border: 2px solid #000
  `
})
export class SymbolButtonComponent {
  @Input() size: number = 40;
  @Input() iconSize?: number;
  @Input() color?: string;
}
