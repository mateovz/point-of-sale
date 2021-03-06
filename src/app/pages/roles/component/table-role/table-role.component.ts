import { Component, OnInit } from '@angular/core';
import { BaseTable } from 'src/app/shared/utils/base-table';
import { Role, RoleResponse } from 'src/app/shared/models/role.interface';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-table-role',
  templateUrl: './table-role.component.html',
  styleUrls: ['./table-role.component.scss']
})
export class TableRoleComponent extends BaseTable implements OnInit {
  
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
    this.pageSize = roles.length;
    this.collectionSize = roles.length;
    this.values = roles;
    this.allValues = this.values;
  }

  ngOnInit(): void {
  }

}
