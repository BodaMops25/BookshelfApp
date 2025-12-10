import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { BackendApiService } from '../../services/backend-api/backend-api.service';
import { FormComponent } from "../../components/form/form.component";
import { SubmitEventData } from '../../entities';
import { checkFormDataProps, makeAlert } from '../../utilities';

@Component({
  selector: 'new-quote',
  imports: [HeaderComponent, FormComponent],
  template: `
    <header-component></header-component>
    <main class="mt-5">
      <div class="form-wrapper">
        <form-component formTitle="Add quote" (submitEvent)="submitHandler($event)">

          <div class="form-floating">
            <input required type="text" name="title" id="title" class="form-control" placeholder="">
            <label for="title">Title*</label>
          </div>
          
          <div class="form-floating">
            <input required type="text" name="text" id="text" class="form-control" placeholder="">
            <label for="text">Text*</label>
          </div>
    
          <div class="form-floating">
            <input required type="text" name="author" id="author" class="form-control" placeholder="">
            <label for="author">Author*</label>
          </div>
    
          <div class="form-floating">
            <input required type="text" name="bookTitle" id="bookTitle" class="form-control" placeholder="">
            <label for="bookTitle">Book title*</label>
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

export class NewQuotePage {

  constructor(private backendApi: BackendApiService, private router: Router) {}

  submitHandler({formData}: SubmitEventData) {
    const data = checkFormDataProps(
      [
        'title',
        'author',
        'text',
        'bookTitle'
      ],
      formData
    )

    if(data === undefined) {
      makeAlert('Bad form information', 'danger')
      return
    }

    this.backendApi.Quotes.post(
      {
        title: data['title'],
        author: data['author'],
        text: data['text'],
        bookTitle: data['bookTitle']
      }
    )
    .subscribe({
      next: (response) => {
        console.log(response)
        this.router.navigate(['user/quotes'])
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else {
          makeAlert('Can\'t create quote, reload page or come back later', 'danger')
          console.log(error);
        }
      }
    })
  }
}
