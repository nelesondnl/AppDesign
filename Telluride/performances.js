var sql = require( 'sqlite3' ).verbose();
var http = require('http');
var fs = require('fs');

function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    var key_value_pairs = parts[1].split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    return kvs
}

function perform_server(req, res)
{

  var filename = "./" + req.url;
  try {
      var contents = fs.readFileSync( filename ).toString();
      res.writeHead( 200 );
      res.end( contents );
  }

  catch(exp)
  {
    if( req.url.indexOf( "perf_time?" ) >= 0 )
    {
      var db = new sql.Database( 'telluride.sqlite' );
      var kvs = getFormValuesFromURL( req.url );
      db.all( 'SELECT Performers.Name as PerfName, * '+
        'FROM Performances '+
            'JOIN Performers ON Performers.ID = Performances.PID '+
            'JOIN Stages ON Stages.ID = Performances.SID',
      function( err, rows ) {
        if( err )
        {
            console.log( err );
            res.writeHead(200);
            res.end("Error Occurs");
        }
        else{
          res.writeHead(200);
          var resp_text = "<html><body><table><tbody>";
          var count = 0;
          for( var i = 0; i < rows.length; i++ )
          {
             //console.log(kvs);
             //console.log(rows[i].Time.split(':')[0]);
             var perf_time = rows[i].Time.split(':')[0];
             var input_time = kvs['get_time'];
             if(parseInt(perf_time) > input_time)
             {
                //console.log(typeof(perf_time));
                resp_text += "<tr><td>" + rows[i].PerfName + "</td><td>"
                + rows[i].Name + "</td><td>" + rows[i].Time + "</td></tr>";
                count++;
             }
          }
          if (count == 0)
          {
              resp_text = "<html><body>" + "no match!" + "</body></html>";
          }
          else {
            resp_text += "</tbody></table></body></html>";
          }
          res.end( resp_text );
       }
      } );
    }

    else{
      res.writeHead( 404 );
      res.end( "Cannot find file: "+filename );
    }
  }
}

var server =  http.createServer( perform_server );
server.listen(8080);
