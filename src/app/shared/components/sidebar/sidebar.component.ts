import { Component, Input, OnInit } from '@angular/core';
import { ListGroup } from './interfaces/sidebar.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() currentRoute!:string;
  @Input() isActiveSidenav!:boolean;

  listGroup: ListGroup[] = [
    {title: 'Estadisticas', name:'statitics', items: [
      {name: 'Panel', icon:'bi bi-speedometer2', path:'/'}
    ]},
    {title: 'Compras y ventas', name:'SaleBuy', items: [
      {name: 'Compras', icon:'bi bi-cart-fill', path:'/purchases'},
      {name: 'Ventas', icon:'bi bi-bag', path:'/sales'}
    ]},
    {title: 'Inventario', name:'Inventary', items: [
      {name: 'Categorias', icon:'bi bi-tag', path:'/categories'},
      {name: 'Productos', icon:'bi bi-archive-fill', path:'/products'}
    ]},
    {title: 'Proveedores y clientes', name:'ProviderClient', items: [
      {name: 'Proveedores', icon:'bi bi-truck', path:'/providers'},
      {name: 'Clientes', icon:'bi bi-person-fill', path:'/clients'}
    ]},
    {title: 'Usuarios y roles', name:'UserRole', items: [
      {name: 'Usuarios', icon:'bi bi-people-fill', path:'/users'},
      {name: 'Roles y permisos', icon:'bi bi-person-bounding-box', path:'/roles'}
    ]},
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
