const mysql = require( 'mysql' );
const jwt = require( 'jsonwebtoken' );
const crypto = require("crypto")

var connection = mysql.createConnection( {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    multipleStatements: true    
} );

connection.connect( function( err )
{
    if( !err )
        console.log( 'Connected with SQL ... ' );    
    else
        console.log( 'Error connecting to SQL ... ' + err );    
} );

var createSchema =  "CREATE DATABASE IF NOT EXISTS SIMS;" +
                    "CREATE TABLE IF NOT EXISTS SIMS.USERS ( username varchar( 100 ) PRIMARY KEY, email varchar( 100 ), password varchar( 100 ) );" +
                    "REPLACE INTO SIMS.USERS VALUES ( 'SIMS', 'SIMS', 'SIMS' );";

connection.query( createSchema, function( err ) {
    if ( err )
        console.log( "Error in setting up Database>>>" + err);
    else
        console.log( "Database is Set!!" );
} );

exports.authenticate = function( req, res ) {
    
    var user = req.body.username;
    var email = req.body.email;
    var pass = req.body.password;
    var purpose = req.body.purpose;
    
    if ( purpose === "checkUsers" )
    {
        var checkUsersQuery = "SELECT username FROM SIMS.USERS";

        getUserDB( checkUsersQuery, function( err, rows ) {
            if ( !err )
                res.json( rows );
            else
            {
                console.log(err);
                res.status(500).send('Error while performing Query!');
            }
        } );
    }
    //SignUp Code
    else if ( purpose === "signUp" )
    {
        var createUserQuery = "INSERT INTO SIMS.USERS VALUES ( '" + user + "', '" + email + "', '" + encrypt( pass ) + "' )";

        getUserDB( createUserQuery, function( err, rows ) {
            
            console.log(err);
            
            if ( !err )
                res.json( rows );
            else
            {
                console.log(err);
                res.status(500).send('Error while performing Query!');
            }
        } );
    }
    //SignIn Code
    else if ( purpose === "signIn" )
    {
        var checkUserQuery = "SELECT username FROM SIMS.USERS WHERE username = '" + user + "' AND password = '" + encrypt( pass ) + "'";
        var userDetailsQuery = "SELECT * FROM SIMS.USERS WHERE username = '" + user + "';";

        getUserDB( checkUserQuery, function( err, rows ) {
            
            if ( !err )
            {
                if ( rows.length > 0  )
                {
                    getUserDB( userDetailsQuery, function( err, user ) {
                        
                        if ( err )
                            res.status(500).send('Error while performing Query!');
                        
                        if ( user && user[ 0 ] )
                            user = user[ 0 ];
                        
                        if ( !user )
                            return res.status(401).send("The username is not existing");

                        if ( user.password !== encrypt( pass ) )
                            return res.status(401).send("The username or password don't match");

                        res.json( {
                            type: true,
                            data: user,
                            token: createToken( user )
                        } );
                    } );
                }
                else
                {
                    console.log( 'Please check your login-credentials' );
                    res.json( {
                        type: false,
                        data: "Incorrect email/password"
                    } );
                }
            }
            else
            {
                console.log(err);
                res.status(500).send('Error while performing Query!');
            }
        } );
    }

};

exports.getAllStudentDetails = function( req, res )
{
    var regNum = req.body.regNum;
    var studentDetailsQuery = "SELECT * FROM SIMS.STUDENT_INFO";
    
    getUserDB( studentDetailsQuery, function( err, studentData ) {
        
        if ( err )
            res.status(500).send('Error while performing Query!');
        
        res.json(studentData);
        
    } );
}

//Creating the JSON Web Token
function createToken( user ) 
{
    return jwt.sign( user, 'secret', { expiresIn: 60 * 60 * 5 } );
}

//Accessing the Database for the specified user
function getUserDB( _Query, callback )
{
    console.log("Query: " + _Query);
    
    connection.query( _Query, function( err, rows, fields ) {

        if ( err )
            callback( err, rows );

        callback( err, rows );

    } );
}

// Encryption
function encrypt( text )
{
    var cipher = crypto.createCipher( 'aes-256-cbc', 'd6F3Efeq' );
    var crypted = cipher.update( text, 'utf8', 'hex' );
  
    crypted += cipher.final( 'hex' );
  
    return crypted;
}
// Decryption
function decrypt( text )
{
    var decipher = crypto.createDecipher( 'aes-256-cbc', 'd6F3Efeq' );
    var dec = decipher.update( text, 'hex', 'utf8' );
    
    dec += decipher.final( 'utf8' );
    
    return dec;
}