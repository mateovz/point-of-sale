import { Permission } from "./permission.interface";

export interface Role{
    id?:number;
    name:string;
    slug:string;
    description?:string;
    permissions:Array<Permission>;
}