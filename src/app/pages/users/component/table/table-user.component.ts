import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseTableComponent } from 'src/app/shared/components/base-table/base-table.component';
import { User } from 'src/app/shared/models/user.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'component-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})
export class TableUserComponent extends BaseTableComponent implements OnInit {

  @Input() columns!: string[];
  @Input() users!: Observable<User[]>;

  @Output() onUpdateUser: EventEmitter<User> = new EventEmitter<User>();
  @Output() onDeleteUser: EventEmitter<User> = new EventEmitter<User>();

  public override values: User[] = [];
  public override allValues: User[] = [];

  constructor(
    private permissionService: PermissionService,
  ) { 
    super();
  }

  ngOnInit(): void {
    this.users.subscribe((users: User[]) => {
      this.setUsers(users);
      this.baseTable();
    });
  }

  setUsers(users: User[]){
    this.values = users;
    this.allValues = this.values;
  }

  private baseTable(){
    this.pageSize = 10;
    this.collectionSize = this.values.length;
  }

  onUpdateModal(user: User){
    this.onUpdateUser.emit(user);
  }
  onDelete(user: User){
    this.onDeleteUser.emit(user);
  }

  check = (slug:string) => this.permissionService.checkPermission(slug);
}