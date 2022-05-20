import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'user-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @HostBinding('class') class = 'col-3'

  @Input() user!: User;

  constructor() { }

  ngOnInit(): void {
  }
}
