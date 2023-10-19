import { Application, NextFunction, Response } from "express";
import { ServerRequest, ControllerResponse, ControllerType } from "../types";
import { resolve } from "path";

/**
 * Function to route the request to the controller
 * @description
 * This function is used to route the request to the controller.
 * We are assuming that the routeLoader middleware has already loaded the route and set it to req.route.
 * We are can to validate the route, but we are not doing it here because the routeLoader middleware has already validated the route and set to default route if the route is not valid.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @param app 
 */
const route = (req: ServerRequest, res: Response, next: NextFunction, app: Application) => {

    // Create the controller file path.
    // This path will be used to check if file exists before importing it. Upsss. we are already checking it in routeLoader middleware. It is only used to import the controller.
    const filePath = resolve(`src/controllers/${req.route.controller ?? 'home'}.ts`);

    // Import the controller
    const ctrl = import (filePath);

    // Import is async, so we need to wait for it to complete.
    Promise.resolve(ctrl).then(async (Controller:any) => {
        // Get the controller function
        const fn:ControllerType = Controller.default[req.route.fn];

        // Call the controller function and get the response
        const response:ControllerResponse = await fn(req);

        // Set the response to the client by checking the response status. Status is true or false
        let code = response.status ? 200 : 500;

        // if controller has set the status code, then use it.
        if(response.code) code = response.code; 

        // Set the response to the client by checking the response type.
        switch(response.type) {
            // If the response type is html, then send the html file.
            case 'html':
                res.setHeader('Content-Type', 'text/html');
                res.status(code).sendFile(resolve(`src/views/${response.html}` || 'src/views/404.html'));
            break;
            case 'json':
            default: 
                // If the response type is json, then send the json data. Also, default response type is json.
                res.setHeader('Content-Type', 'application/json');
                res.status(code).send(response);
            break;
        }
    });

    
    
       
    
    

   
}

export { route };