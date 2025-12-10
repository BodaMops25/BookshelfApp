import { Component, OnInit } from '@angular/core';
import { BookItemComponent } from "../../components/bookItem/bookItem.component";
import { NgForOf } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { Book, SubmitEventData } from '../../entities';
import { HeaderComponent } from "../../components/header/header.component";
import { BackendApiService } from '../../services/backend-api/backend-api.service';
import { FormComponent } from "../../components/form/form.component";
import { checkFormDataProps, makeAlert } from '../../utilities';

@Component({
  selector: 'books-page',
  standalone: true,
  imports: [BookItemComponent, NgForOf, RouterLink, HeaderComponent, FormComponent],
  template: `
    <header-component></header-component>

    <main class="container-fluid py-4">
      <div class="d-flex flex-wrap gap-4">

        <div *ngFor="let book of books" style="flex: 1 1 auto">
          <book-item 
            [info]="book"
            (editEvent)="onBookEdit(book.id)"
            (deleteEvent)="onBookDelete(book.id)"
          ></book-item>
        </div>

        <div id="book-edit-modal" class="modal fade" tabindex="-1">
          <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <div class="modal-content">
              
              <div class="modal-body">

                <form-component formTitle="Edit book" (submitEvent)="onBookEditSubmit($event)">

                  <div class="form-floating">
                    <input required type="text" name="title" id="title" class="form-control" placeholder="">
                    <label for="title">Title*</label>
                  </div>

                  <div class="form-floating">
                    <input required type="text" name="author" id="author" class="form-control" placeholder="">
                    <label for="author">Author*</label>
                  </div>

                  <div class="form-floating">
                    <input required type="Date" name="releaseDate" id="releaseDate" class="form-control" placeholder="">
                    <label for="releaseDate">Release Date*</label>
                  </div>

                  <div class="form-floating">
                    <input required type="number" name="pages" id="pages" class="form-control" placeholder="">
                    <label for="pages">Pages*</label>
                  </div>

                  <div class="form-floating">
                    <input required type="text" name="genres" id="genres" class="form-control" placeholder="">
                    <label for="genres">Genres*</label>
                  </div>

                  <div class="form-floating">
                    <input required type="number" name="rating" id="rating" class="form-control" placeholder="">
                    <label for="rating">Rating*</label>
                  </div>

                </form-component>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>

    <button routerLink="/new-book" class="btn btn-primary position-fixed bottom-0 start-50 translate-middle-x mb-3 ">Add book</button>
  `,
  styles: ``
})
export class BooksPage implements OnInit {

  constructor(private backendApi: BackendApiService, private router: Router) {}
  
  books: Book[] = []
  bookEditId?: string

  bsBookEditModal?: any;

  ngOnInit(): void {
    this.backendApi.Books.getByUser()
    .subscribe({
      next: (books) => {
        this.books = books
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else makeAlert('Something went wrong, reload page or come back later', 'danger')
      }
    })
  }

  onBookEdit(bookId: string) {
    this.bookEditId = bookId
    //@ts-ignore
    if(this.bsBookEditModal == undefined) this.bsBookEditModal = new bootstrap.Modal('#book-edit-modal')
    this.bsBookEditModal.show()
  }

  onBookEditSubmit({formData}: SubmitEventData) {
    if(this.bookEditId === undefined) {
      makeAlert('No book identificator, try again', 'danger')
      return
    }
    
    const data = checkFormDataProps(
      [
        'title',
        'author',
        'releaseDate',
        'pages',
        'genres',
        'rating'
      ],
      formData
    )

    if(data === undefined) {
      makeAlert('Bad form information', 'danger')
      return
    }

    this.backendApi.Books.update(this.bookEditId, {
      title: data['title'],
      author: data['author'],
      releaseDate: data['releaseDate'],
      pages: +data['pages'],
      genres: data['genres'],
      rating: +data['rating'],
    })
    .subscribe({
      next: (response) => {

        const updatedBookIndex = this.books.findIndex(book => book.id === this.bookEditId);
        if(response) this.books[updatedBookIndex] = response
        
        this.bookEditId = undefined
        this.bsBookEditModal?.hide()

        makeAlert('Book was updated', 'success')
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else {
          makeAlert('Can\'t update book, reload page or come back later', 'danger')
          console.log(error);
        }
      }
    })
  }

  closeEditBookForm() {this.bookEditId = undefined}

  onBookDelete(bookId: string) {
    this.backendApi.Books.delete(bookId)
    .subscribe({
      next: (response) => {
        const deletingBookIndex = this.books.findIndex(book => book.id === bookId)
        this.books.splice(deletingBookIndex, 1)

        makeAlert('Book was removed', 'success')
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else {
          makeAlert('Can\'t remove book, reload page or come back later', 'danger')
          console.log(error)
        }
      }
    })
  }
}
