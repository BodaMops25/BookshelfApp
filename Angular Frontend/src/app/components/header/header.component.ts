import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { User } from '../../entities';
import { BackendApiService } from '../../services/backend-api/backend-api.service';

@Component({
  selector: 'header-component',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="border-bottom border-2">
      <div class="container-fluid px-2 d-flex justify-content-between py-2">

        <nav class="navbar navbar-expand-lg p-0 fs-3 nav-p">

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#page-nav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="page-nav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">

              <li class="nav-item">
                <a class="nav-link" routerLink="/user/books" routerLinkActive="active">Books</a>
              </li>

              <li class="nav-item">
                <a class="nav-link" routerLink="/user/quotes" routerLinkActive="active">Quotes</a>
              </li>

            </ul>
          </div>

        </nav>

        <div #userInfo class="user" (click)="userInfoHandler()">

          <div class="dropdown">
            <a
              class="text-dark"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="true"
            >
              <i class="fa-solid fa-circle-user" style="font-size: 3em"></i>
            </a>

            <ul class="dropdown-menu dropdown-menu-end">
              <li class="dropdown-item-text">
                Username: {{ user?.login }}
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button routerLink="/user" class="dropdown-item text-primary">
                  Change username or password
                </button>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger" (click)="logOutHandler()">
                  Log out
                </button>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </header>
  `,
  styles: `
    .text-primary:active
      color: var(--bs-dropdown-link-hover-bg) !important

    .text-danger:active
      color: var(--bs-dropdown-link-hover-bg) !important
      background-color: var(--bs-danger) !important

    .fa-circle-user
      color: var(--bs-body-color)
  `
})

export class HeaderComponent implements OnInit{

  @ViewChild('userInfo') userInfoElement?: ElementRef;

  user?: User
  isUserDetails = false

  constructor(private backendApi: BackendApiService, private router: Router) {}

  ngOnInit(): void {
    this.backendApi.Users.get()
    .subscribe({
      next: (user) => {
        this.user = user
      },
      error: (error) => {
        if(error.status === 401) this.router.navigate(['/user/entry'])
        else {
          alert('Something went very wrong, you will be redirected to login page')
          this.router.navigate(['/user/entry'])
        }
      }
    })

    document.addEventListener('click', (event) => {
      const element = event.composedPath().find(node => node === this.userInfoElement?.nativeElement)
      if(element === undefined) this.isUserDetails = false
    })
  }

  userInfoHandler() {
    this.isUserDetails = true
  }

  logOutHandler() {
    localStorage.removeItem('userAuthToken')
    this.router.navigate(['/user/entry'])
  }
}
