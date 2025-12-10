import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { BackendApiService } from '../../services/backend-api/backend-api.service';
import { SubmitEventData } from '../../entities';
import { FormComponent } from "../../components/form/form.component";
import { checkFormDataProps, makeAlert } from '../../utilities';

@Component({
  selector: 'new-book',
  imports: [HeaderComponent, FormComponent],
  template: `
    <header-component></header-component>
    <main class="mt-5">
      <div class="form-wrapper">
        <form-component formTitle="Add book" (submitEvent)="submitHandler($event)">

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
    </main>
  `,
  styles: `
    .form-wrapper
      max-width: 500px
      margin: 0 auto
  `
})

export class NewBookPage {

  constructor(private backendApi: BackendApiService, private router: Router) {}

  submitHandler({formData}: SubmitEventData) {

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
    
    this.backendApi.Books.post({
      title: data['title'],
      author: data['author'],
      releaseDate: data['releaseDate'],
      pages: +data['pages'],
      genres: data['genres'],
      rating: +data['rating'],
    })
    .subscribe({
      next: (response) => {
        console.log(response)
        this.router.navigate(['user/books'])
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else {
          makeAlert('Can\'t create book, reload page or come back later', 'danger')
          console.log(error);
        }
      }
    })
  }
}
