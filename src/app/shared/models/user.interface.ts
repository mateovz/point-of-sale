import { Role } from "./role.interface";

export interface User{
    id?:number;
    name?:string;
    email:string;
    password?:string;
    roles:Array<Role>;
    token?:string;
}

export interface UserLogin {
    email: string;
    password:string;
    device?:string;
}

export interface LoginResponse{
    status: string;
    token: string;
    user: User;
}