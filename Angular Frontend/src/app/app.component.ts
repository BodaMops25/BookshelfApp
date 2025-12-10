import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: ` 
    <!-- <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/user/entry">Entry</a>
      <a routerLink="/user/books">My books</a>
    </nav> -->
    <router-outlet></router-outlet>
    <div (click)="toogleDarkMode()" class="toogle-theme-btn rounded-circle d-flex justify-content-center align-items-center">
      <i class="fa-solid fs-4 fa-circle-half-stroke"></i>
    </div>
  `,
  styles: `
    nav
      display: flex
      justify-content: flex-start
      gap: 15px

    .toogle-theme-btn
      width: 60px
      height: 60px
      background-color: var(--bs-secondary-bg);
      position: fixed
      bottom: 2em
      right: 2em
      cursor: pointer
      transition: transform 0.2s ease;

      &:hover
        transform: scale(1.05) rotate(15deg)
  `,
})

export class AppComponent {

  toogleDarkMode() {
    const ds = document.documentElement.dataset
    if(ds['bsTheme'] === 'dark') {
      delete ds['bsTheme']
      localStorage.removeItem('documentTheme')
    }
    else {
      ds['bsTheme'] = 'dark'
      localStorage['documentTheme'] = 'dark'
    }
  }
}
