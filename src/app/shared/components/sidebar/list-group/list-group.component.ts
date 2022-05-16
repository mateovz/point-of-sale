import { Component, Input, OnInit } from '@angular/core';
import { ListGroup } from '../interfaces/sidebar.interface';

@Component({
  selector: 'sidebar-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.css']
})

export class ListGroupComponent implements OnInit {

  @Input() listGroup!:ListGroup;
  @Input() currentRoute!:string;
  itemsPath: string[] = [];

  constructor() { }

  ngOnInit(): void {
    if(this.listGroup)
      this.listGroup.items.map((item) => {
        this.itemsPath.push(item.path);
      });
  }

}
