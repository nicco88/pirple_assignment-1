# Homework Assignment #1

## Requirements
Please create a simple "Hello World" API. Meaning:

1. It should be a RESTful JSON API that listens on a port of your choice. 

2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want. 

### 1. Start the server and test it
```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );

// The server should respond to all requests with a string
const server = http.createServer( ( req, res ) => {
  // We send a string in response to any request
  res.end( 'Hello There!\n');
});

// Starting the server; listening on port 3000
server.listen( 3000, () => {
  console.log("SERVER LISTENING ON PORT 3000!")
});
```
### 2. Gathering the desired data
Desired data:
1. Request Paths
2. HTTP methods
3. Query Strings
4. Headers
5. Payloads

#### 2.1 Parsing Request Paths

```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const url = require( 'url' );


const server = http.createServer( ( req, res ) => {
  /** We now want to get the URL and parse it.
   * The second argument means "parse the query string
   * and return an object".
   * Be aware the default is set to false.
   */
  const parsedURL = url.parse( req.url, true );

  // Get the path ↓↓↓↓↓↓↓↓↓
  const path = parsedURL.pathname;
  // remove any "/" from beginning or end
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  
  res.end( 'Hello There!\n');

  // Log the path
  console.log( `Request received on path: ${ trimmedPath }` );
});


server.listen( 3000, () => {
  console.log("SERVER LISTENING ON PORT 3000!")
});
```
Now test it by hitting a random path like `localhost:3000/hello`

Expected log: `Request received on path: hello`

#### 2.2 Parsing HTTP methods
```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const url = require( 'url' );


const server = http.createServer( ( req, res ) => {

  // Get the path
  const parsedURL = url.parse( req.url, true );
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the HTTP method ↓↓↓↓↓↓↓↓
  const method = req.method.toLowerCase();
  
  res.end( 'Hello There!\n' );

  // Logging
  console.log( `Request received on path: ${ trimmedPath }\n` );
  console.log( `Request received with the following method: ${ method }\n` );
});


server.listen( 3000, () => {
  console.log("SERVER LISTENING ON PORT 3000!")
});
```
Expected log: `Request received with the following method: get`

#### 2.3 Parsing query strings
```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const url = require( 'url' );


const server = http.createServer( ( req, res ) => {

  // Get the path
  const parsedURL = url.parse( req.url, true );
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object ↓↓↓↓↓↓↓
  const queryStringObject = parsedURL.query;


  // Get the HTTP method
  const method = req.method.toLowerCase();
  
  res.end( 'Hello There!\n');

  // Logging
  console.log( `Request received on path: ${ trimmedPath }\n` );
  console.log( `... with the following method: ${ method }\n` );
  console.log( '... with the following query parameters: ', queryStringObject );
});


server.listen( 3000, () => {
  console.log("SERVER LISTENING ON PORT 3000!")
});



```
Now hit the following route: `http://localhost:3000/hello?name=niccolo&surname=perego`
Expected log: `... with the following query parameters:  { name: 'niccolo', surname: 'perego' }`

#### 2.4 Parsing headers

```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const url = require( 'url' );


const server = http.createServer( ( req, res ) => {

  // Get the path
  const parsedURL = url.parse( req.url, true );
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers ↓↓↓↓↓↓↓↓↓↓↓
  const headers = req.headers;
  
  res.end( 'Hello There!\n');

  // Logging
  console.log( `Request received on path: ${ trimmedPath }\n` );
  console.log( `... with the following method: ${ method }\n` );
  console.log( '... with the following query parameters: ', queryStringObject );
  console.log( '... with the following headers: ', headers );
});


server.listen( 3000, () => {
  console.log("SERVER LISTENING ON PORT 3000!")
});
```

Expected a log with an object containing all headers information.

#### 2.5 Parsing Payloads

```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const url = require( 'url' );
const StringDecoder = require( 'string_decoder' ).StringDecoder;

const server = http.createServer( ( req, res ) => {

  // Get the path
  const parsedURL = url.parse( req.url, true );
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder( 'utf-8' );
  let buffer = '';

  // On receinving the data event, 
  // we append data on to the buffer
  req.on( 'data', ( data ) => buffer += decoder.write( data ) );

  /** The 'end' event is fired when the stream ends,
   * and it's always called, regardless of the data
   * being called or not
   */
  req.on( 'end', ( data ) => {
    buffer += decoder.end();

    // res.end() and logging moved here, 
    // as the 'end' event is always fired
    res.end( 'The request process ended! \n' )

    // Logging
    console.log( `Request received on path: ${ trimmedPath }\n` );
    console.log( `... with the following method: ${ method }\n` );
    console.log( '... with the following query parameters: ', queryStringObject );
    console.log( '... with the following headers: ', headers );

    /* The payload could be a huge JSON object, a small string or even nothing */
    console.log( `\n... with this payload: `, buffer );
  });
});


server.listen( 3000, () => {
  console.log("SERVER LISTENING ON PORT 3000!")
});
```

### 3. Routing Requests

1. Define the router object with a sample route, pointing to its handler
2. Define the handlers (empty object)
3. Define the **sample handler**, which accepts **data** and a **callback**
4. Define the **'not found' handler**, not to be placed inside the router; it'll be called if all the other routes are not called
5. We'll put all the logic in the **'end' event**, as it is always fired
6. Determine which handler the request should go to; see if the route exists by using `typeof( router[ trimmedPath ])`
7. If the typeof router is `undefined`, that is it doesn't exist, then send 'not found'
8. Construct the **data object** to send to the handler based on the data we gathered so far
9. We call the `chosenHandler()`, passing in the **data** as the _1st argument_; as _2nd argument_ we pass a **callback**, with **status code** and **payload**
10. In the `chosenHandler()`'s callback, we use the **status code** called back by the handler, or default to 200
  - IF _typeof_ status code === number → use handler's status code
  - ELSE → default to 200 (even if the type is 'undefined')
11. In the `chosenHandler()`'s callback, we use the **payload (buffer)** called back by the handler, or default to empty object
  - IF _typeof_ payload === 'object' → use handller's payload
  - ELSE → use {}
12. Convert the **payload object** to a **string** so that it can be logged out by `JSON.stringify()`
13. Return the response
  - Use `res.writeHead( statusCode )` to log the status code
  - Use `res.end( payloadString ) to log the payload string
14. Test with postman

```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const url = require( 'url' );
const StringDecoder = require( 'string_decoder' ).StringDecoder;


const server = http.createServer( ( req, res ) => {

  // Get the path
  const parsedURL = url.parse( req.url, true );
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder( 'utf-8' );
  let buffer = '';

  req.on( 'data', ( data ) => buffer += decoder.write( data ) );

  req.on( 'end', ( ) => {
    buffer += decoder.end();

    /** Choose the handler this request should
     * go to. If not found, use the 'not found' 
     * handler.
     * Router and handlers defined below.
     * It's a way to say, if you find the chosen
     * path in the router, then use that path's 
     * handler, otherwise (undefined) use 
     * the 'not found' one.
     */
    const chosenHandler = typeof( router[ trimmedPath ])  
                            !== 'undefined' ?
                              router[ trimmedPath ]
                              : handlers.notFound;
    
    // Construct the data object to send to the handler
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer,
    }

    /** Route the request to the handler specified
     * in the router.
     */
    chosenHandler( data, ( statusCode, payload ) => {
      /** Use the status code called by the handler,
       * or default to 200
       */
      statusCode = typeof( statusCode )
                    === 'number' ?
                      statusCode
                      : 200;

      /** Use the payload called back by the handler,
       * or default to an empty object
       */
      payload = typeof( payload )
                === 'object' ?
                  payload
                  : {};
      
      /** Convert the payload object to a string;
       * not the payload we receive, but the payload
       * that the handler is sending back to the user.
       */
      const payloadString = JSON.stringify( payload );

      // Return the response
      res.writeHead( statusCode );

      // Send a string in response to any request
      res.end( payloadString );

      console.log( 'Returning this response: ',
                    statusCode, payloadString );
    });
  });
});

/********** */
server.listen( 3000, () => {
  console.log("SERVER LISTENING ON PORT 3000!")
});
/********** */

// Define the handlers
let handlers = {};

// Define a sample handler
handlers.cowabunga = ( data, callback ) => {
  // Callback an HTTP status code and a payload object
  callback( 200, { 'message' : 'cowabunga handler' });
}

// Define the 'not found' handler
handlers.notFound = ( data, callback ) => callback( 404 );

// Define the request router
// Each router has a custom handler
const router = {
  'cowabunga': handlers.cowabunga,
};
```

### 4. Returning JSON

Just add the following line inside the `chosenHandler()` function; `setHeader()` takes in a key-value pair:
```js
res.setHeader( 'Content-Type', 'application/json' );
```

### 5.  Adding configuration

1. Create a `config.js` file.
2. Set a container object to store all environments (staging, production)
3. Assign the port and the environment name to different environment objects
4. Determine which environment object should be exported
5. Check that the environment input is one we defined, else default to staging
6. Export the module

```js
/* 
  Create and export the configuration variables
*/

// Container for all the environments
let environments = {};

// Staging (default) environment
environments.staging = {
  'port': 3000,
  'envName': 'staging'
};

// Production environment
environments.production = {
  'port': 5000,
  'envName': 'production'
};

/** Determine which environment was passed 
 * as a command line argument */
const currentEnv = typeof( process.env.NODE_ENV )
                  === 'string' ?
                    process.env.NODE_ENV.toLowerCase()
                    : '';

/* 
  Check that the current environment is one of the 
  environments above, if not, default to 
  staging (just for convenience)
*/
const envToExport = typeof( environments[ currentEnv ] )
                      === 'object' ?
                        environments[ currentEnv ]
                        : environments.staging;

// Export the module
module.exports = envToExport;
```

6. Require `config.js` in `index.js`
7. On `server.listen()` we are going to dynamically set the port, instead of being hard-coded

```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const url = require( 'url' );
const StringDecoder = require( 'string_decoder' )
                        .StringDecoder;

const config = require('./config');


const server = http.createServer( ( req, res ) => {

  // Get the path
  const parsedURL = url.parse( req.url, true );
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder( 'utf-8' );
  let buffer = '';

  req.on( 'data', ( data ) => buffer += decoder.write( data ) );

  req.on( 'end', ( ) => {
    buffer += decoder.end();

    const chosenHandler = typeof( router[ trimmedPath ])  
                            !== 'undefined' ?
                              router[ trimmedPath ]
                              : handlers.notFound;
    
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer,
    }

    chosenHandler( data, ( statusCode, payload ) => {
      statusCode = typeof( statusCode )
                    === 'number' ?
                      statusCode
                      : 200;

      payload = typeof( payload )
                === 'object' ?
                  payload
                  : {};
      
      const payloadString = JSON.stringify( payload );

      res.setHeader( 'Content-Type', 'application/json');

      // Return the response
      res.writeHead( statusCode );

      // Send a string in response to any request
      res.end( payloadString );

      console.log( 'Returning this response: ',
                    statusCode, payloadString );
    });
  });
});

/********** */
server.listen( config.port, () => {
  console.log(`SERVER LISTENING ON PORT ${ config.port } in ${ config.envName } mode!`);
});
/********** */

// Define the handlers
let handlers = {};

// Define a sample handler
handlers.cowabunga = ( data, callback ) => {
  // Callback an HTTP status code and a payload object
  callback( 200, { 'message' : 'cowabunga handler' });
}

// Define the 'not found' handler
handlers.notFound = ( data, callback ) => callback( 404 );

const router = {
  'cowabunga': handlers.cowabunga,
};
```

8. In the command line: `NODE_ENV=<modeName> node index.js`

### 6. Adding HTTPS support

Use openSSL

1. make a `https` folder
2. cd into it and `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`
3. This command will genrate two files: `cert.pem` and `key.pem`
4. We now use these two files to create an https server
5. In `config.js`, rather than having one port, we're going to have two now
6. On most production apps, http is going to happen on port 80, and https on port 443 (it's just a widespread convention); on localhost it doesn't matter

```js
/* 
  Create and export the configuration variables
*/

// Container for all the environments
let environments = {};

// Staging (default) environment
environments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging'
};

// Production environment
environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production'
};

/** Determine which environment was passed 
 * as a command line argument */
const currentEnv = typeof( process.env.NODE_ENV )
                  === 'string' ?
                    process.env.NODE_ENV.toLowerCase()
                    : '';

/* 
  Check that the current environment is one of the 
  environments above, if not, default to 
  staging (just for convenience)
*/
const envToExport = typeof( environments[ currentEnv ] )
                      === 'object' ?
                        environments[ currentEnv ]
                        : environments.staging;

// Export the module
module.exports = envToExport;
```

#### Refactoring the server file

1. In `index.js` create a `unifiedServer` function that has the logic usable by both http server and https server
2. Take all the content inside the `server` callback function and put it into the `unifiedServer()` function
3. Now call the `unifiedServer()` into the server's callback
4. Now update the `server.listen()`'s callback to reflect the ports changes
5. Require the `https` module, which is natively available
6. Instantiate both the http server and the https server
7. The https server will need some options as argument, before the callback in the `createServer()` method
8. Those options will be the https _key_ and _cert_ we just generated
9. To do that, we require the `fs` module and use the `readFileSync()` method
  - Whenever possible, we want to use the async one, but in this case the sync one makes sense
10. Test with both environments

```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const https = require( 'https' );
const url = require( 'url' );
const StringDecoder = require( 'string_decoder' )
                        .StringDecoder;

const config = require('./config');

const fs = require( 'fs' );

// Instatiate the HTTP server
const httpServer = http.createServer( ( req, res ) => {
  unifiedServer( req, res );
});

// Start the HTTP server
/********** */
httpServer.listen( config.httpPort, () => {
  console.log(`SERVER LISTENING ON PORT ${ config.httpPort } in ${ config.envName } mode!`);
});
/********** */

const httpsServerOptions = {
  'key' : fs.readFileSync( './https/key.pem' ),
  'cert': fs.readFileSync( './https/cert.pem' )
};

// Instantiate the HTTPS server
const httpsServer = https.createServer( httpsServerOptions, ( req, res ) => {
  unifiedServer( req, res );
});

// Start the HTTPS server
/***************** */
httpsServer.listen( config.httpsPort, () => {
  console.log(`SERVER LISTENING ON PORT ${ config.httpsPort } in ${ config.envName } mode!`);
});
/***************** */

/** Server logic for both http and https server */
const unifiedServer = ( req, res ) => {
  // Get the path
  const parsedURL = url.parse( req.url, true );
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder( 'utf-8' );
  let buffer = '';

  req.on( 'data', ( data ) => buffer += decoder.write( data ) );

  req.on( 'end', ( ) => {
    buffer += decoder.end();

    const chosenHandler = typeof( router[ trimmedPath ])  
                            !== 'undefined' ?
                              router[ trimmedPath ]
                              : handlers.notFound;
    
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer,
    }

    chosenHandler( data, ( statusCode, payload ) => {
      statusCode = typeof( statusCode )
                    === 'number' ?
                      statusCode
                      : 200;

      payload = typeof( payload )
                === 'object' ?
                  payload
                  : {};
      
      const payloadString = JSON.stringify( payload );

      res.setHeader( 'Content-Type', 'application/json');

      // Return the response
      res.writeHead( statusCode );

      // Send a string in response to any request
      res.end( payloadString );

      console.log( 'Returning this response: ',
                    statusCode, payloadString );
    });
  });
};

// Define the handlers
let handlers = {};

// Define a sample handler
handlers.cowabunga = ( data, callback ) => {
  // Callback an HTTP status code and a payload object
  callback( 406, { 'message' : 'cowabunga handler' });
}

// Define the 'not found' handler
handlers.notFound = ( data, callback ) => callback( 404 );

const router = {
  'cowabunga': handlers.cowabunga,
};
```

### 7. /ping
The `/ping` route is for assessing if the server is up running or not.

```js
/* 
  Primary file for the API
*/

// Dependencies
const http = require( 'http' );
const https = require( 'https' );
const url = require( 'url' );
const StringDecoder = require( 'string_decoder' )
                        .StringDecoder;

const config = require('./config');

const fs = require( 'fs' );

// Instatiate the HTTP server
const httpServer = http.createServer( ( req, res ) => {
  unifiedServer( req, res );
});

// Start the HTTP server
/********** */
httpServer.listen( config.httpPort, () => {
  console.log(`SERVER LISTENING ON PORT ${ config.httpPort } in ${ config.envName } mode!`);
});
/********** */

const httpsServerOptions = {
  'key' : fs.readFileSync( './https/key.pem' ),
  'cert': fs.readFileSync( './https/cert.pem' )
};

// Instantiate the HTTPS server
const httpsServer = https.createServer( httpsServerOptions, ( req, res ) => {
  unifiedServer( req, res );
});

// Start the HTTPS server
/***************** */
httpsServer.listen( config.httpsPort, () => {
  console.log(`SERVER LISTENING ON PORT ${ config.httpsPort } in ${ config.envName } mode!`);
});
/***************** */

/** Server logic for both http and https server */
const unifiedServer = ( req, res ) => {
  // Get the path
  const parsedURL = url.parse( req.url, true );
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder( 'utf-8' );
  let buffer = '';

  req.on( 'data', ( data ) => buffer += decoder.write( data ) );

  req.on( 'end', ( ) => {
    buffer += decoder.end();

    const chosenHandler = typeof( router[ trimmedPath ])  
                            !== 'undefined' ?
                              router[ trimmedPath ]
                              : handlers.notFound;
    
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer,
    }

    chosenHandler( data, ( statusCode, payload ) => {
      statusCode = typeof( statusCode )
                    === 'number' ?
                      statusCode
                      : 200;

      payload = typeof( payload )
                === 'object' ?
                  payload
                  : {};
      
      const payloadString = JSON.stringify( payload );

      res.setHeader( 'Content-Type', 'application/json');

      // Return the response
      res.writeHead( statusCode );

      // Send a string in response to any request
      res.end( payloadString );

      console.log( 'Returning this response: ',
                    statusCode, payloadString );
    });
  });
};

// Define the handlers
let handlers = {};

// ping handler
handlers.ping = ( data, callback ) => {
  callback( 200 );
}

// Define a sample handler
handlers.cowabunga = ( data, callback ) => {
  // Callback an HTTP status code and a payload object
  callback( 200, { 'meassage' : 'Cowabunga!!! XD' });
}

// Define the 'not found' handler
handlers.notFound = ( data, callback ) => callback( 404 );

const router = {
  'ping': handlers.ping,
  'cowabunga': handlers.cowabunga,
};
```