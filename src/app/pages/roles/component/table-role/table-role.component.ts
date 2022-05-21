import { Component, OnInit } from '@angular/core';
import { BaseTableComponent } from 'src/app/shared/components/base-table/base-table.component';
import { Role, RoleResponse } from 'src/app/shared/models/role.interface';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-table-role',
  templateUrl: './table-role.component.html',
  styleUrls: ['./table-role.component.css']
})
export class TableRoleComponent extends BaseTableComponent implements OnInit {
  
  public columns: string[] = ['#', 'Nombre'];
  public override values: Role[] = [];
  public override allValues: Role[] = [];

  constructor(
    private roleService: RolesService,
  ) { 
    super();
    this.getRoles();
  }

  private getRoles(){
    this.roleService.getAll().subscribe((res: RoleResponse) => {
      if(res.roles) {
        this.baseTable(res.roles);
      }
    })
  }

  private baseTable(roles: Role[]){
    this.pageSize = 5;
    this.collectionSize = roles.length;
    this.values = roles;
    this.allValues = this.values;
  }

  ngOnInit(): void {
  }

}
