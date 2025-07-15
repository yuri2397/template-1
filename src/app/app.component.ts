import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SimplebarAngularModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'template-1';
  isHomePage = false;
  oneOfAuthPages = true;
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = event.url === '/' || event.url === '';
      // this.oneOfAuthPages = event.url === '/login' || event.url === '/register' || event.url === '/forgot-password'
      console.clear();
      console.log(this.oneOfAuthPages);
    });

    this.isHomePage = this.router.url === '/' || this.router.url === '';
  }
}