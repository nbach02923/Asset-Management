
import { Request } from 'express';
export interface payload {
    id: string;
    userName: string;
    role: number | boolean;
    departmentId: string;
}

export interface CustomRequest extends Request {
    id: string;
    role: number | boolean;
    userName: string;
    departmentId: string;
}
