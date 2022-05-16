import { Component, Input, OnInit } from '@angular/core';
import { ListGroupItem } from '../interfaces/sidebar.interface';

@Component({
  selector: 'sidebar-list-group-items',
  templateUrl: './list-group-items.component.html',
  styleUrls: ['./list-group-items.component.css']
})

export class ListGroupItemsComponent implements OnInit {

  @Input() item!: ListGroupItem;
  @Input() currentRoute!:string;

  constructor() { }

  ngOnInit(): void {
  }

}
