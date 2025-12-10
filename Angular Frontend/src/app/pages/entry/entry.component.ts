import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BackendApiService } from '../../services/backend-api/backend-api.service';
import { FormComponent } from "../../components/form/form.component";
import { SubmitEventData } from '../../entities';
import { makeAlert } from '../../utilities';

@Component({
  selector: 'entry',
  imports: [FormComponent],
  template: `
    <main class="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div class="d-flex flex-column flex-md-row gap-5 text-center align-items-start">

        <form-component formTitle="Create Account" (submitEvent)="registrationHandler($event)" class="p-4 rounded shadow">

          <div class="form-floating">
            <input required type="text" name="login" id="reg-login" class="form-control" placeholder="">
            <label for="reg-login">Login*</label>
          </div>

          <div class="form-floating">
            <input required type="password" name="pass" id="reg-pass" class="form-control" placeholder="">
            <label for="reg-pass">Password*</label>
          </div>

          <div class="form-floating">
            <input required type="password" name="pass-confirm" id="reg-pass-confirm" class="form-control" placeholder="">
            <label for="reg-pass-confirm">Confirm password*</label>
          </div>

        </form-component>

        <form-component formTitle="Login" (submitEvent)="loginHandler($event)" class="p-4 rounded shadow">

          <div class="form-floating">
            <input required type="text" name="login" id="login-login" class="form-control" placeholder="">
            <label for="login-login">Login*</label>
          </div>

          <div class="form-floating">
            <input required type="password" name="pass" id="login-pass" class="form-control" placeholder="">
            <label for="login-pass">Password*</label>
          </div>

        </form-component>
      </div>
    </main>
  `,

  styles: `
    form-component
      background-color: var(--bs-secondary-bg)
  `
})

export class EntryPage {

  constructor(private backendApi: BackendApiService, private router: Router) {}

  registrationHandler({formData}: SubmitEventData) {

    const login = formData.get('login')?.toString()
    const pass = formData.get('pass')?.toString()

    if(login === undefined || pass === undefined) {
      makeAlert('Login or password not set', 'danger')
      return
    }

    if(pass !== formData.get('pass-confirm')) {
      makeAlert('Password not confirmed!', 'danger')
      return
    }

    this.backendApi.Users.post(login, pass)
    .subscribe({
      error: (error) => {
        makeAlert('Something went wrong!', 'danger')
        console.log(error)
      }
    })
  }

  loginHandler({formData}: SubmitEventData) {
    const login = formData.get('login')?.toString()
    const pass = formData.get('pass')?.toString()

    if(
      login === '' || login === undefined ||
      pass === '' || pass === undefined
    ) {
      makeAlert('Login or password not set', 'danger')
      return
    }

    this.backendApi.Users.login(login, pass)
    .subscribe({
      next: (token) => {
        localStorage['userAuthToken'] = token
        this.router.navigate(['user/books'])
      },
      error: (error) => {
        if(error.status === 404) makeAlert('User don\'t exist', 'warning')
        else {
          makeAlert('Something went wrong!', 'warning')
          console.log(error)
        }
      }
    })
  }
}
