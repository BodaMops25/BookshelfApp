import { Component, Input, Output, output } from '@angular/core';
import { Book } from '../../entities';
import { NgIf } from '@angular/common';
import { SymbolButtonComponent } from '../symbol-button/symbol-button.component';
import { EventEmitter } from 'stream';

@Component({
  selector: 'book-item',
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
        <p class="card-text fst-italic">{{info.genres || 'Genres not defined'}}</p>
          
      </div>
      
      <div class="bottom-info card-footer d-flex gap-4 justify-content-between">
        <p *ngIf="info.releaseDate != null">{{formatDate()}}</p>
        <p *ngIf="info.pages != null">Pages: {{info.pages}}</p>
        <p *ngIf="info.rating != null">Rating: {{info.rating}}/5</p>
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
export class BookItemComponent {
  @Input() info!: Book;

  editEvent = output<void>();
  deleteEvent = output<void>();

  formatDate() {
    const date = new Date(this.info.releaseDate)
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}.${mm}.${dd}`;
  }

  onEdit() {
    this.editEvent.emit()
  }

  onDelete() {
    this.deleteEvent.emit()
  }
}
