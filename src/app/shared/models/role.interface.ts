import { Permission } from "./permission.interface";

export interface Role{
    id?:number;
    name:string;
    slug:string;
    description?:string;
    permissions:Permission[];
}

export interface RoleResponse{
    status:string;
    role?: Role;
    roles?: Role[];
    errors?:any;
}