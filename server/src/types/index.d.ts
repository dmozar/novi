import{ Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export type MongoInstance = typeof mongoose.connection;


export type DbConnections = MongoInstance | null;


/**
 * @fileoverview Type definitions for the server request handlers.
 * @package 
 */
export interface ServerRequest extends Request {
    session: {
        user: UserDocument | null
    },
    route: RouteType
}

export interface AppRequestHandler {
    (req: Request, res: Response, next: NextFunction): void
}



export type User = {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    token: string,
    active: boolean,
    deleted: boolean,
    dateCreated: Date,
    dateUpdated: Date,
}


export interface UserDocument extends User {}

export interface DatabaseResponse {
    [key: string]: string | number | boolean | {[key: string]: string | number | boolean};
}

export type RouteType = {
    path: string,
    method: 'get' | 'post' | 'put' | 'delete',
    controller: string,
    fn: string,
    authenticated?: boolean
    validate?: {[key:string]: string},
    input?: {
        body: {[key:string]: string | number | boolean | {[key: string]: string | number | boolean}},
        query: {[key:string]: string | number | boolean},
        params: {[key:string]: string | number | boolean},
    }
}

export type ControllerResponse = {
    status: boolean,
    message?: string,
    data?: any,
    errors?: any,
    code?: number,
    type?: 'json' | 'html';
    html?: string;
}

export type ControllerType = (req: ServerRequest) => Promise<ControllerResponse>;
