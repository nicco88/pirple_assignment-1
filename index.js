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
handlers.hello = ( data, callback ) => {
  // Callback an HTTP status code and a payload object
  callback( 200, { 'meassage' : 'Cowabunga!!! XD' });
}

// Define the 'not found' handler
handlers.notFound = ( data, callback ) => callback( 404 );

const router = {
  'ping': handlers.ping,
  'hello': handlers.hello,
};


