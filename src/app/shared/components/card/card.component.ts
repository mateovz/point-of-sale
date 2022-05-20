import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'component-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @HostBinding('class') class = 'col-3'

  @Input() imgTop!: string | undefined;
  @Input() title!: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
