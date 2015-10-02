var fs = require( 'fs' );
var http = require( 'http' );
var in_log = "";
function getFormValuesFromURL( url )
{
    //console.log(url);
    var kvs = {};
    var parts = url.split( "?" );
    var key_value_pairs = parts[1].split( "&" );
    var reading_text = [];
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
        reading_text.push(key_value[0]+":"+key_value[1]);
    }
    // console.log( kvs );
    return reading_text;
}

function server_fun( req, res )
{
    console.log( req.url );
    // ...
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp ) {
        // console.log( "huh?", req.url.indexOf( "second_form?" ) );
        if( req.url.indexOf( "first_form?" ) >= 0 )
        {
            var content_read = getFormValuesFromURL( req.url );
            console.log(content_read);
            //var content_write = "";
            for(var i = 0; i < content_read.length; i++)
            {
              in_log += content_read[i];
            }
            res.writeHead( 200 );
            res.end( "You submitted the first form!!!!! ");
            var write_file = fs.writeFileSync("writing.log",in_log);
            console.log(write_file);
        }
        else if( req.url.indexOf( "second_form?" ) >= 0 )
        {
            var content_read = getFormValuesFromURL( req.url );
            for(var i = 0; i < content_read.length; i++)
            {
              in_log += content_read[i];
            }
            res.writeHead( 200 );
            res.end( "You submitted the second form!!!!!" );
            var write_file = fs.writeFileSync("writing.log",in_log);
            console.log(write_file);
        }
        else
        {
            // console.log( exp );
            res.writeHead( 404 );
            res.end( "Cannot find file: "+filename );
        }
    }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
