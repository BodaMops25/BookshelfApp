import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FormComponent } from "../../components/form/form.component";
import { SubmitEventData } from '../../entities';
import { checkFormDataProps, makeAlert } from '../../utilities';
import { BackendApiService } from '../../services/backend-api/backend-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user',
  imports: [HeaderComponent, FormComponent],
  template: `
    <header-component></header-component>
    <main class="mt-5">
      <div class="form-wrapper">
        <form-component formTitle="Change login and password" (submitEvent)="submitHandler($event)" class="">

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
    .form-wrapper
      max-width: 500px
      margin: 0 auto
  `
})
export class UserPage {

  constructor(private backendApi: BackendApiService, private router: Router) {}

  submitHandler({formData}: SubmitEventData) {
    const data = checkFormDataProps(
      ['login', 'pass'],
      formData
    )

    if(data === undefined) {
      makeAlert('Bad form information', 'danger')
      return
    }

    this.backendApi.Users.update({
      login: data['login'],
      password: data['pass']
    })
    .subscribe({
      next: () => {
        this.router.navigate(['/user/books'])
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['user/entry'])
        else makeAlert('Something went wrong, reload page or come back later', 'danger')
      }
    })
  }
}
