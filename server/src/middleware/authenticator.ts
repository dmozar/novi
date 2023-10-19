import { NextFunction, Response } from "express";
import AuthHandler from "./../utils/authHandler";
import { ServerRequest } from "../types";


/**
 * Authenticator middleware
 * @description 
 * This middleware is used to authenticate the user before accessing the resource.
 * Authenticate the user by checking the session data and header bearer token.
 * If the user is not authenticated, the middleware will return 401 status code.
 * If the user is authenticated, the middleware will call the next middleware.
 * Authentication is only required if the route is marked as authenicated.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
const authenticator = async (req: ServerRequest, res: Response, next: NextFunction) => {

    // If the route is marked as authenicated, then authenticate the user.
  
  
    if(req.route.authenticated === true){
        // Create an instance of AuthHandler
        const auth = new AuthHandler(req);

        // Authenticate the user and set the session data.
        const status = await auth.authenticate();

        console.log('authenticator', status);
        if(!status) req.session = {} as any;

        // check if the user is authenticated.
        if (req.session && req.session.user && req.session.user._id) {
            // If the user is authenticated, then call the next middleware.
            next();
        } else {
            // If the user is not authenticated, then return 401 status code.
            res.status(401).send({
                error: 'Not authorized to access this resource',
            });
        }
    } else {
        // If the route is not marked as authenicated, then call the next middleware.
        next();
    }
};

export { authenticator };