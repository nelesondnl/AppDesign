var http = require( 'http' );
var fs = require('fs');

function server_fun( req, res )
{
    //console.log( req );
    console.log( req.url );
    var fn = req.url.split('/')[1];
    console.log(fn);
    try {
        var f = fs.readFileSync( fn );
    }
    catch( e ) {
        // return [];
        res.end('enter a file');
    }

    try{
       var contents = f.toString();
     }
     catch(e)
     {
       var contents = 'file does not exist in the current directory.'
     }
    res.writeHead( 200 );
    res.end( contents );
}

var server = http.createServer( server_fun );

server.listen( 8080 );
