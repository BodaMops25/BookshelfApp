import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QuoteItemComponent } from "../../components/quoteItem/quoteItem.component";
import { NgForOf } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { Quote, SubmitEventData } from '../../entities';
import { HeaderComponent } from "../../components/header/header.component";
import { BackendApiService } from '../../services/backend-api/backend-api.service';
import { FormComponent } from "../../components/form/form.component";
import { checkFormDataProps, makeAlert } from '../../utilities';

@Component({
  selector: 'quotes-page',
  standalone: true,
  imports: [QuoteItemComponent, NgForOf, RouterLink, HeaderComponent, FormComponent],
  template: `
    <header-component></header-component>
    <main class="container-fluid py-4">
      <div #quotesList class="d-flex flex-wrap gap-4">

        <div *ngFor="let quote of quotes" style="flex: 1 1 auto">
          <div class="quote-item">
            <quote-item [info]="quote" (likeEvent)="onQuoteLike(quote.id)" (editEvent)="onQuoteEdit(quote.id)" (deleteEvent)="onQuoteDelete(quote.id)"></quote-item>
          </div>
        </div>

        <div id="quote-edit-modal" class="modal fade" tabindex="-1">
          <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <div class="modal-content">
              
              <div class="modal-body">
                <form-component formTitle="Edit quote" (submitEvent)="onQuoteEditSubmit($event)">

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

            </div>
          </div>
        </div>

      </div>
    </main>

    <button routerLink="/new-quote" class="btn btn-primary position-fixed bottom-0 start-50 translate-middle-x mb-3 ">Add quote</button>
  `,
  styles: `

  `
})
export class QuotesPage implements OnInit {

  constructor(private backendApi: BackendApiService, private router: Router) {}
  
  @ViewChild('quotesList') quotesList!: ElementRef;

  quotes: Quote[] = []
  quoteEditId?: string
  bsQuoteEditModal?: any;

  ngOnInit(): void {
    this.backendApi.Quotes.getByUser()
    .subscribe({
      next: (quotes) => {
        this.quotes = quotes.sort((q1, q2) => {
          if(q1.liked === true && q2.liked !== true) return -1
          else if(q2.liked === true && q1.liked !== true) return 1
          return 0
        })
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else makeAlert('Something went wrong, reload page or come back later', 'danger')
      }
    })
  }

  onQuoteLike(quoteId: string) {
    const currentQuote = this.quotes.find(q => q.id === quoteId)

    if(currentQuote) {
      currentQuote.liked = !currentQuote.liked

      this.backendApi.Quotes.update(quoteId, {
        liked: currentQuote.liked
      })
      .subscribe({
        next: () => {
          if(currentQuote.liked) makeAlert('Quote is favorite', 'success')
          else makeAlert('Quote is not favorite', 'success')
          
          this.quotes.sort((q1, q2) => {
            if(q1.liked === true && q2.liked !== true) return -1
            else if(q2.liked === true && q1.liked !== true) return 1
            return 0
          })
        },
        error: (error) => {
          if(error.status === 401) this.router.navigate(['user/entry'])
          else {
            makeAlert('Can\'t update quote, reload page or come back later', 'danger')
            console.log(error);
          }
        }
      })
    }

    else makeAlert('No quote identificator, try again', 'danger')
  }

  onQuoteEdit(quoteId: string) {
    this.quoteEditId = quoteId
    //@ts-ignore
    if(this.bsQuoteEditModal === undefined) this.bsQuoteEditModal = new bootstrap.Modal('#quote-edit-modal')
    this.bsQuoteEditModal.show()
  }

  onQuoteEditSubmit({formData}: SubmitEventData) {
    if(this.quoteEditId === undefined) {
      makeAlert('No quote identificator, try again', 'danger')
      return
    }

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

    this.backendApi.Quotes.update(this.quoteEditId,
      {
        title: data['title'],
        author: data['author'],
        text: data['text'],
        bookTitle: data['bookTitle']
      }
    )
    .subscribe({
      next: (response) => {
        const updateQuoteIndex = this.quotes.findIndex(quote => quote.id === this.quoteEditId);
        if(response) this.quotes[updateQuoteIndex] = response

        this.bsQuoteEditModal?.hide()
        this.quoteEditId = undefined

        makeAlert('Quote was updated', 'success')
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else {
          makeAlert('Can\'t update quote, reload page or come back later', 'danger')
          console.log(error);
        }
      }
    })
  }

  closeEditQuoteForm() {this.quoteEditId = undefined}

  onQuoteDelete(quoteId: string) {
    this.backendApi.Quotes.delete(quoteId)
    .subscribe({
      next: (response) => {
        const deletingQuoteIndex = this.quotes.findIndex(quote => quote.id === quoteId)
        this.quotes.splice(deletingQuoteIndex, 1)

        makeAlert('Quote was removed', 'success')
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else {
          makeAlert('Can\'t remove quote, reload page or come back later', 'danger')
          console.log(error)
        }
      }
    })
  }
}
