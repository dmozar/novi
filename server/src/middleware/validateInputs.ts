import { NextFunction, Response } from "express";
import { ServerRequest } from "../../src/types";
import '../../src/utils/string';

/**
 * Validate inputs middleware
 * 
 * @description
 * This middleware is used to validate the inputs and this is something which gives the power to the framework.
 * With this middleware, we can validate the inputs and send the error response to the client easily without writing any code.
 * Validation rules are set in the route file. 
 * If validation fails, then the middleware will return 400 status code with error response before calling the controller, so
 * the controller will not be called if the validation fails and that means we don't need to write any code to validate the inputs in the controller.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const validateInputs = async (req: ServerRequest, res: Response, next: NextFunction) => {

    if(!req.route.validate) return next();

    const files = req.files;

    const body = req.body;

    const params = req.params;

    const query = req.query;

    const mergedData = { ...files, ...body, ...params, ...query };

    const validateRules = req.route.validate;

    const errors = [];

    for(let key in validateRules){
        if(validateRules[key]){

            const validateArr:string[] = validateRules[key].split('|');

            for(let v = 0; v < validateArr.length; v++){

                const opt = validateArr[v].split(':');

                const validatePath = `../../src/utils/validate/${opt[0]}`;

                const validate = await import(validatePath);
                
                const validateResponse = await validate.default?.(mergedData[key], opt[1] || undefined);

                if(validateResponse !== undefined){
                    errors.push({
                        key,
                        message: validateResponse
                    });
                }
            }
        }
    };

    if(errors.length > 0) return res.status(400).send({
        status: false,
        code: 400,
        message: 'Your request contains invalid data',
        errors
    });

    next();
}

export { validateInputs };