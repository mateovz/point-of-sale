import { User } from "src/app/shared/models/user.interface";

export interface RegisterData{
    title: string;
    user?: User;
}

export interface ResponseMessage{
    error?: boolean,
    message?: string
}