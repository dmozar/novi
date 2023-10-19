import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { route } from './src/middleware/route';
import { ServerRequest, AppRequestHandler } from './src/types';
import multer from 'multer';
import { routesLoader } from './src/middleware/routeLoader';
import { authenticator } from './src/middleware/authenticator';
import { validateInputs } from './src/middleware/validateInputs';
import cors from 'cors';

const forms = multer();

//For env File 
dotenv.config();

// Define upload path
multer({ dest: 'public/' })




// Create Express server
const app = express();


app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
}));


// Express configuration static files
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(forms.array('form-data', 50));




// Load app into request
// app.use((req, res, next) => {
//   req.app = app;
//   next();
// });


// Express configuration body-parser for application/json  and application/x-www-form-urlencoded
app.use(express.json());


// Define routes based on request path and method
app.use(routesLoader as AppRequestHandler);


// Authenticate routes if is required in route definition
app.use(async (req: Request, res: Response, next: NextFunction) => {
  await authenticator(req as ServerRequest, res, next);
});


app.use(validateInputs as any);

// Load route controller
app.use((req: Request, res: Response, next: NextFunction) => {
  // Access the 'app' object using req.app

  // Use app as needed
  route(req as ServerRequest, res, next, app);
});



// Express configuration port
const port = process.env.PORT || 8000;



// Start Express server
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});



