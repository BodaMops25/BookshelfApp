import { Component, Input, Output, output } from '@angular/core';
import { Book, Quote } from '../../entities';
import { NgIf } from '@angular/common';
import { SymbolButtonComponent } from '../symbol-button/symbol-button.component';

@Component({
  selector: 'quote-item',
  imports: [NgIf, SymbolButtonComponent],
  template: `
    <div class="card">
      <div class="card-body position-relative">

        <div class="edit-buttons">
          <symbol-button (click)="onEdit()">
            <i class="fa-solid fa-pen"></i>
          </symbol-button>
          <symbol-button (click)="onDelete()">
            <i class="fa-solid fa-trash-can"></i>
          </symbol-button>
        </div>

        <p class="card-title fs-5 mb-0">{{info.title}}</p>
        <p class="card-subtitle mb-1 opacity-75">{{info.author}}</p>
        <p class="card-text fst-italic">"{{info.text}}"</p>  
      </div>

      <div *ngIf="info.bookTitle" class="bottom-info card-footer d-flex gap-4 justify-content-between">
        {{info.bookTitle}}
      </div>
    </div>
  `,
  styles: `
    .card
      min-width: 300px

    .card:hover .edit-buttons
      display: flex

    .edit-buttons
      display: none
      align-items: center
      gap: 10px
      position: absolute
      top: 0
      right: 0
      padding: 6px 12px
      z-index: 1
  `
})
export class QuoteItemComponent {
  @Input() info!: Quote;

  editEvent = output<void>();
  deleteEvent = output<void>();

  onEdit() {
    this.editEvent.emit()
  }

  onDelete() {
    this.deleteEvent.emit()
  }
}
