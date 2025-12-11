import { ApplicationConfig,
  provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BooksPage } from './pages/books/books.component';
import { HomePage } from './pages/home/home.component';
import { provideHttpClient } from '@angular/common/http';
import { EntryPage } from './pages/entry/entry.component';
import { NewBookPage } from './pages/new-book/new-book.component';
import { QuotesPage } from './pages/quotes/quotes.component';
import { NewQuotePage } from './pages/new-quote/new-quote.component';
import { UserPage } from './pages/user/user.component';

const routes: Routes= [
  {path: '', component: HomePage},
  {path: 'user/entry', component: EntryPage},
  {path: 'user', component: UserPage},
  {path: 'user/books', component: BooksPage},
  {path: 'user/quotes', component: QuotesPage},
  {path: 'new-book', component: NewBookPage},
  {path: 'new-quote', component: NewQuotePage},
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient()
  ]
};
