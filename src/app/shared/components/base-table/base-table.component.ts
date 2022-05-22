import { Component, OnInit } from '@angular/core';

export interface SearchOption{
  name: string;
  value: string;
}

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.css']
})
export class BaseTableComponent{

  public searchTerm!: string;
  public searchBy: SearchOption = {name: '', value: ''};
  public searchOptions!: SearchOption[];
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
    this.values = this.allValues;
    this.collectionSize = this.values.length;
  }

  onChangeSearchBy(option: SearchOption){
    this.searchBy = option;
  }

  getSearchOptions():SearchOption[]{
    return Object.values(this.searchOptions);
  }
}
