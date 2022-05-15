import { Role } from "./role.interface";

export interface User{
    id?:number;
    name?:string;
    email?:string;
    password?:string;
    roles?:Role[];
    token?:string;
    avatar?:string;
    avatarSource?: any;
}

export interface UserRegister{
    name?:string;
    email?:string;
    password?:string;
    roles?:Role[];
    avatar?:string;
    avatarSource?: any;
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