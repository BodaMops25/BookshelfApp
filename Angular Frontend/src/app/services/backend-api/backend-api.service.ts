import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book, BookFields, Quote, QuoteFields, User, UserFields } from '../../entities';
import appConfig from '../../../app-config';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService{

  host = `http://${appConfig.backendApiServerHost}/api/`
  userAuthToken?: string;

  constructor(private http: HttpClient) {}

  authOptionsToRequest() {
    return {headers: {Authorization: 'Bearer ' + localStorage['userAuthToken']}}
  }

  Users = {
    login: (login: string, password: string) => this.http.post<string>(this.host + 'user/login', {login, password}, this.authOptionsToRequest()),
    post: (login: string, password: string) => this.http.post<User>(this.host + 'user', {login, password}, this.authOptionsToRequest()),
    get: () => this.http.get<User>(this.host + 'user', this.authOptionsToRequest()),
    update: (data: UserFields) => this.http.put<User>(this.host + 'user', data, this.authOptionsToRequest()),
    delete: () => this.http.delete<User>(this.host + 'user', this.authOptionsToRequest()),
  }

  Books = {
    getByUser: () => this.http.get<Book[]>(this.host + 'user/books', this.authOptionsToRequest()),
    post: (book: BookFields) => this.http.post<Book>(this.host + 'book', book, this.authOptionsToRequest()),
    get: (bookId: string) => this.http.get<Book>(this.host + 'book/' + bookId, this.authOptionsToRequest()),
    update: (bookId: string, data: BookFields) => this.http.put<Book>(this.host + 'book/' + bookId, data, this.authOptionsToRequest()),
    delete: (bookId: string) => this.http.delete<Book>(this.host + 'book/' + bookId, this.authOptionsToRequest()),
  }

  Quotes = {
    getByUser: () => this.http.get<Quote[]>(this.host + 'user/quotes', this.authOptionsToRequest()),
    post: (quote: QuoteFields) => this.http.post<Quote>(this.host + 'quote', quote, this.authOptionsToRequest()),
    get: (quoteId: string) => this.http.get<Quote>(this.host + 'quote/' + quoteId, this.authOptionsToRequest()),
    update: (quoteId: string, data: QuoteFields) => this.http.put<Quote>(this.host + 'quote/' + quoteId, data, this.authOptionsToRequest()),
    delete: (quoteId: string) => this.http.delete<Quote>(this.host + 'quote/' + quoteId, this.authOptionsToRequest()),
  }
}
