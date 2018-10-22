const express  = require( 'express' );
const bodyParser = require( 'body-parser' );
const https = require('https');
const fs = require('fs');
const routes = require( './routes.js' );
const authorize = require( './jwt-authorize.js' );
const app = express();
const port = 3001;

/*
 * 
 * @Self-signed certificate
 * openssl genrsa -out key.pem
 * openssl req -new -key key.pem -out csr.pem
 * openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
 * rm csr.pem
 */

const options = {
  key: fs.readFileSync('SSL/key.pem'),
  cert: fs.readFileSync('SSL/cert.pem')
};

app.use( bodyParser.urlencoded( { 'extended': 'true' } ) );
app.use( bodyParser.json() );
app.use( bodyParser.json( { type: 'application/vnd.api+json' } ) );

app.post( '/SIMS', routes.authenticate );
app.use( '/SIMS/', authorize.tokenAuthentication );
app.get( '/SIMS/getAllStudentDetails/', routes.getAllStudentDetails );

app.use( express.static( 'public_html' ) );
app.get( '/', function( req, res ) {
    res.sendFile( __dirname + '/public_html/' );
} );

https.createServer(options, app).listen(port);
console.log( 'SIMS listening on port: ' + port + '\nGo For https://localhost:' + port);

//app.listen( 8000 );
//console.log( 'SIMS listening on port: ' + port + '\nGo For localhost:' + port);
