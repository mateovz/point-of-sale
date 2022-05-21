import { Component, OnInit } from '@angular/core';
import { Role } from '../../models/role.interface';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.css']
})
export class BaseTableComponent{

  public searchTerm!: string;
  public page = 1;
  public pageSize = 4;
  public collectionSize!: number;
  public currentRate = 8;
  public values!: any[];
  public allValues!: any[];

  constructor() { 
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.values = this.allValues.filter((val) => val.name.toLowerCase().includes(value));
    this.collectionSize = this.values.length;
  }

}
