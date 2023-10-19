import { ServerRequest, ControllerResponse } from "src/types";

class Controller {

    static async index(req: ServerRequest):Promise<ControllerResponse> {
        
        return {
            code: 404,
            status: false,
            message: 'Ups! Something went wrong. Please check your request url and try again.',
            data: {
                path: req.path,
                method: req.method,
            }
        }
    }

    static async home(req: ServerRequest):Promise<ControllerResponse> {
        return {
            type: 'html',
            status: true,
            html: 'index.html',
        }
    }


    static async error(req: ServerRequest):Promise<ControllerResponse> {
        return {
            type: 'html',
            status: true,
            html: '404.html',
        }
    }
}

export default Controller;