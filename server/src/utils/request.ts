import { ServerRequest, RouteType } from "../types";
import fs from 'fs';
import { resolve } from 'path';

export function getRequestData(req: ServerRequest): any {

    return {
        body: req.body,
        query: req.query,
        params: req.params,
        user: req.session?.user,
        route: req.route,
        path: req.path,
        method: req.method.toLowerCase(),
    }
}

/**
 * Match route
 * @description Match route from request path. Function will dynamically import routes from src/routes folder and match the route.
 * @param path
 * @returns Promise<RouteType | undefined>
 */
export async function matchRoute(path: string, req: ServerRequest): Promise<RouteType | undefined> {

    // Create default route. Will be returned if no route is found
    const defaultRoute: RouteType = {
        path: '/',
        controller: 'home',
        method: 'get',
        fn: 'index',
        authenticated: false,
    }

    // split path into array
    const splitPath = path.split('/');

    // prepare list of paths to check
    const listPaths = [];

    // prepare matched route
    let matchedRoute: RouteType | undefined;

    // loop through path array and create list of paths to check
    for (let i = 0; i < splitPath.length; i++) {
        listPaths.push(splitPath.slice(0, i + 1).join('/'));
    }

    // reverse list of paths to get longest path first
    listPaths.reverse();

    // loop through list of paths and check if route exists
    for (let p of listPaths) {

        // get absolute path to route file
        const filePath = resolve(`src/routes${p || '/home'}.ts`);

        // if file does not exist continue
        if (!fs.existsSync(filePath)) continue;

        // import routes from file
        const routes = await import(filePath);

        // find route in routes matching path
        const route = routes.default.find((route: RouteType) => {
            return route.path === path || regexMatchRoute(route.path, path, req);
        });

        // if route is found, break out of loop
        if (route !== undefined) {

            route.input = {
                body: req.body,
                query: req.query,
                params: req.params
            }

            matchedRoute = route;
            break;
        }
    };


    // if no route is found, return default route but first try to find matching path with current path from home routes
    if (matchedRoute === undefined) {
        const filePath = resolve(`src/routes/home.ts`);
        const routes = await import(filePath);

        const route = routes.default.find((route: RouteType) => {

            return route.path === path || regexMatchRoute(route.path, path, req);
        });
        
        if (route !== undefined) {
            route.input = {
                body: req.body,
                query: req.query,
                params: req.params
            }
            matchedRoute = route;
        }
    }

    // return matched route
    return matchedRoute ?? defaultRoute;

}



export function regexMatchRoute(routeFromConfig: string, currentURLPath: string, req: ServerRequest) {

    // Escape special characters and create a regex pattern
    const escapedRoute = routeFromConfig.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regexPattern = escapedRoute.replace(/:\w+/g, '([^/]+)');
    const routeRegex = new RegExp(`^${regexPattern}$`);

    // Test if the current URL path matches the route pattern
    const match = currentURLPath.match(routeRegex);

    if (match) {
        // The current URL path matches the route pattern, and match is an array
        // where the first element (at index 0) is the full match, and subsequent
        // elements correspond to captured groups in the regex.

        // Extract the parameter values
        const parameterValues = match.slice(1);

        // Get the parameter names from the route
        const parameterNames = routeFromConfig.match(/:\w+/g)?.map(param => param.slice(1)) || [];

        // Create an object with parameter names as keys and values from the URL
        const parameters: { [key: string]: string } = {};
        parameterNames.forEach((param, index) => {
            parameters[param] = parameterValues[index];
        });

        // merge parameters into request params
        req.params = { ...req.params, ...parameters };

    }

    return match !== null;
}