import { Request } from "express";
import formidable from 'formidable';

/**
 * Get form data from request
 * @description
 * This middleware is used to get the form data from the request.
 * Usually, the form data is sent using POST, PUT, PATCH, or DELETE method and it is easy if is sent with form-urlencoded or json format, 
 * but if the form data is sent with multipart/form-data format, then we need to use this middleware to get the form data.
 * For that reason, this middleware is used to get the form data from the request and set it to req.body.
 * To astoblish this, we use "formidable" package.
 * 
 * @param req 
 */
const formParser = async (req: Request):Promise<void> => {
    // Prepare fields object
    let fields:any = {};

    // Enter this block if the request method is POST, PUT, PATCH, or DELETE
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {

      // Create an instance of formidable
      const form = formidable({});
  
      // Parse the request and get the form data
      const f = await form.parse(req);
  
      // Loop through the form data and set it to fields object
      if(f && Object.keys(f).length > 0) {
        for(let key in f) {
          // Check if the form data has a key
          if(f && Object.keys(f[key]).length > 0) {
            // Loop through the key and set the value to fields object
            for(let key2 in f[key]) {

              // get values
              const values = f[key][key2];

              // Check if the values is an array and has only one value then remove the array and set the value to fields object, otherwise set the values to fields object.
              if(Array.isArray(values) && values.length === 1) {
                fields[key2] = values[0];
              } else {
                fields[key2] = values;
              }

            }
          }
        }
      }
  
      // Loop through the request body and set it to fields object if in case the request body has a value, but not in the form data. This is very rare case, but we need to handle it.
      if(req.body) {
        Object.keys(req.body).forEach((key) => {
          fields[key] = req.body[key];
        });
      }
  
    }
  
    // Set the fields object to req.body, so req.body will have the form data.
    req.body = fields;
}

export { formParser };