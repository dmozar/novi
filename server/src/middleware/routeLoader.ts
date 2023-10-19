import { NextFunction, Response } from "express";
import { ServerRequest } from "../types";
import { getRequestData, matchRoute } from "../utils/request";

/**
 * Routes loader middleware
 * 
 * @description
 * This middleware is used to load the route. This is important middleware and there is no way to skip this middleware.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
const routesLoader = (req: ServerRequest, res: Response, next: NextFunction) => {

    // Get basic request data such as  body, query, params, req.session?.user, route, path, method
    const request = getRequestData(req);

    // Match route. This function will dynamically import routes from src/routes folder and match the route.
    // If the route is not found, then it will return default route.
    Promise.resolve( matchRoute( request.path, req ) ).then((route) => {
        // Check if the route is found for the case if something goes wrong.
        if( route === undefined) return res.sendStatus(404);

        // also check if the method from request is same as method from route
        // if not, then return 405 status code
        if(request.method !== route.method) return res.sendStatus(405);

        // Set the route to req.route
        req.route = route;
    
        // Call the next middleware
        next();
    });

   
}

export { routesLoader };