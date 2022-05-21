import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/shared/models/user.interface';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'component-users-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() columns!: string[];
  @Input() users!: User[];

  @Output() onUpdateUser: EventEmitter<User> = new EventEmitter<User>();
  @Output() onDeleteUser: EventEmitter<User> = new EventEmitter<User>();

  constructor(
    private permissionService: PermissionService,
  ) { }

  ngOnInit(): void {
  }

  onUpdateModal(user: User){
    this.onUpdateUser.emit(user);
  }
  onDelete(user: User){
    this.onDeleteUser.emit(user);
  }

  check = (slug:string) => this.permissionService.checkPermission(slug);
}
