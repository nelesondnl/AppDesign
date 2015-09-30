var http = require( 'http' );
var fs   = require( 'fs' );
var fn1 = process.argv[2];
var url_list = [];
var file_name = [];

if(process.argv.length < 3)
{
  console.log('a txt file is needed');
  process.exit(1);
}

try
{
  var lines = fs.readFileSync( fn1 ).toString().split('\n');
}

catch(e)
{
  console.log("Error: Something bad happened trying to open "+ fn1);
  process.exit( 1 );
}

for(var i = 0; i < lines.length; i++)
{
  var pieces = lines[i].split(' ');
  file_name.push(pieces[0]);
  url_list.push(pieces[1]);
}

function download( url, dest, callback )
{
    //console.log(file_name);
    console.log( "Start downloading!!" );
    var file = fs.createWriteStream( dest );

    var request = http.get( url, function( response ) {
         console.log( "response??? ", response );
        console.log( "response??? " );
        file.on( 'finish', function() {
            console.log( "Finished writing!" );
        } );
        response.pipe( file );
    } );

    // Not temporally after the "get" is done!!!!!!!!

    request.on( 'error', function( err ) {
        console.log( "Error!!!", err );
    } );

    console.log( "Sent request" );
}

for (var i = 0; i < url_list.length-1; i++)
{
//download( "http://cs.coloradocollege.edu/index.html", "cs.html", null );
   download( url_list[i], file_name[i], null );
   console.log( "Done?" );
}

//console.log(file_name[1]);
