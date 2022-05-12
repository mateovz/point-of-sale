import { Role } from "./role.interface";

export interface User{
    id?:number;
    name?:string;
    email?:string;
    password?:string;
    roles?:Role[];
    token?:string;
}

export interface UserLogin {
    email: string;
    password:string;
    device?:string;
}

export interface UserResponse{
    status: string;
    token: string;
    user: User;
    users: User[];
    errors:any;
}