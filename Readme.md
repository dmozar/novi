# React.js && Express.js with TypeScript Starter Kit

# Task

Create a web application with the following requirements:

Functionality:

* Registration page: The user should be able to register with their first name, last name, email address, and password. When they click the "register" button, the user should be created in the database and the user should be redirected to the "home" page.

* Home page: The user should see the text "Welcome {first name} {last name}". If the user refreshes the browser, they should still be logged in. There should also be a log out button. When the user clicks the log out button, the session should be deleted and the user should be redirected back to the registration page.

Requirements:

* Add validation to ensure that the user is making valid inputs (e.g. that the email address has a valid format and the password is at least 6 characters long). The first name and last name fields are required.

* For the frontend, use React and TypeScript.

* For the backend, use NodeJS, Express, TypeScript and MongoDB.

This project is a starter kit for building web applications using React.js and Express.js with TypeScript. The project is divided into two parts: the client and the server.

## Client

The client part is built using React.js and TypeScript. The structure of the React application is as follows:

- public
- src

The `src` directory is structured as follows:

- components
- configs
- layout
- pages
- services
- styles
- utils
- index.tsx

- `components`: Contains context, form, page, brand, busy components.
- `configs`: Includes axios, forms, routes, and settings configurations.
- `layout`: Contains various layouts depending on the page's requirements.
- `pages`: Contains error, home, login, logout, and register pages.
- `services`: Houses authService.
- `utils`: Contains auth and axios utility functions.
- `index.tsx`: The entry point for the React application.

The application features user authentication with login and registration functionality. It also offers a home page and supports theme selection (light and dark).

### How to Start the Client

To start the client, run the following commands:

```bash
yarn
```

```bash
yarn start
```

To build the client for production, use:
```bash
yarn build
```

Application will be on port 3000

## SERVER

The server is built using Express.js and TypeScript. It includes automatic parameter validation based on route configuration settings, making coding easier. The database is MongoDB.


The application features an extended MongoDB model to enhance MongoDB functions for custom operations. JWT tokens are used for validation and are integrated as middleware based on route settings.

### Server Directory Structure

- public: For serving static files.
- src

The src directory contains:

- controller
- middleware
- models
- repositories
- routes
- types
- utils
- views

The server application follows the MVC (Model-View-Controller) design pattern. It uses a Singleton pattern for database connection.

### How to Start the Server

For the first time use 

```bash
yarn
```

```bash
yarn setup
```
This command will install required table

yarn start or yarn dev will start application on port 7711

When you start server, open http://locahost:7711 which will show a welcome HTML page

## Getting Started

To set up this starter kit, follow these steps:

1. Clone this repository.
2. Navigate to the client and server directories and run yarn install to install dependencies.
3. Configure your environment variables.
4. Start the client and server as described above.
5. Feel free to customize and extend this starter kit to build your web applications with React.js and Express.js.

"Both the Client and Server applications have been built from scratch, without using pre-existing solutions, to demonstrate our development capabilities and problem-solving skills. The Server application is fully functional and can be used as an API server for other applications. The Client application, however, requires additional configuration for the head section, server-side rendering (SSR), etc., and has been created solely for testing purposes. Additionally, the testing part has not been implemented yet. We have included TODOs in the application for future improvements, if necessary."