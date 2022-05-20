import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupItemsComponent } from './list-group-items.component';

describe('ListGroupItemsComponent', () => {
  let component: ListGroupItemsComponent;
  let fixture: ComponentFixture<ListGroupItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGroupItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGroupItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
