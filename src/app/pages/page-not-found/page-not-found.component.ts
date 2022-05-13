import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  @HostBinding('class') class = 'flex-fill';
  constructor() { }

  ngOnInit(): void {
  }

}
