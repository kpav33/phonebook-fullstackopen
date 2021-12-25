# Part3

In this part our focus shifts towards the backend, that is, towards implementing functionality on the server side of the stack. We will implement a simple REST API in Node.js by using the Express library, and the application's data will be stored in a MongoDB database. At the end of this part, we will deploy our application to the internet.

## Applications

The phonebook application is deployed on Heroku and accessible on the [https://mighty-plateau-10046.herokuapp.com/](https://mighty-plateau-10046.herokuapp.com/) address. To start the application:

```console
# Install dependencies
npm install
# The application requires a MongoDB URI with password to the database which must be stored in the .env file!
# Start the application
npm run dev
```