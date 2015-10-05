var http = require('http');
var fs = require('fs');
var sql = require('sqlite3').verbose();

function getFormValFromURL(url)
{
  var kvs = {};
  var form_parts = url.split("?");
  var kvs_pairs = form_parts[1].split("&");
  for(var i = 0; i < kvs_pairs.length; i++)
  {
    var key_val = kvs_pairs[i].split("=");
    kvs[key_val[0]] = key_val[1];
  }
  return kvs;
}

function getKeyValFromURL(url)
{
  var kvf = [];
  var form_parts = url.split("?");
  var kvs_pairs = form_parts[1].split("&");
  for(var i = 0; i < kvs_pairs.length; i++)
  {
    var key_val = kvs_pairs[i].split("=");
    kvf.push(key_val[1]);
  }
  return kvf;
}

function server_weather(req, res)
{
  try{
      var fn = "./" + req.url;
      var fn_content = fs.readFileSync( fn ).toString();
      res.writeHead( 200 );
      res.end( fn_content );
   }

   catch(exp){
     if( req.url.indexOf( "weather_form?" ) >= 0 )
     {
         var db = new sql.Database( 'weather.sqlite' );
         var kvs = getFormValFromURL(req.url);
         db.all( "SELECT * FROM weather_data",
          function( err, rows ) {
          res.writeHead( 200 );
          resp_text = "";
          kvs = getFormValFromURL( req.url );
          for( var i = 0; i < rows.length; i++ )
          {
              if(((rows[i].DateUTC_hour > kvs["start_date_hour"])
              ||((rows[i].DateUTC_hour == kvs["start_date_hour"])&&
              (rows[i].DateUTC_minute >= kvs["start_date_minute"])))
              &&((rows[i].DateUTC_hour < kvs["end_date_hour"])||
              ((rows[i].DateUTC_hour == kvs["end_date_hour"])&&
              (rows[i].DateUTC_minute <= kvs["end_date_minute"]))))
              {
               resp_text += rows[i].TimeMDT_hour.toString();
               resp_text += ":";
               resp_text += rows[i].TimeMDT_minute.toString();
               resp_text += rows[i].TimeMDT_pm_or_am + "  ";
               resp_text += rows[i].TemperatureF.toString()+ "  ";
               resp_text += rows[i].Dew_pointF.toString()+ "  ";
               resp_text += rows[i].Humidity.toString()+ "  ";
               resp_text += rows[i].Sea_level_pressureIn.toString()+ "  ";
               resp_text += rows[i].VisibilityMPH.toString()+ "  ";
               resp_text += rows[i].Wind_direction+ "  ";
               resp_text += rows[i].Wind_speedMP.toString()+ "  ";
               resp_text += rows[i].Gust_speedMP.toString()+ "  ";
               resp_text += rows[i].PrecepitationIn + "  ";
               resp_text += rows[i].Events.toString()+ "  ";
               resp_text += rows[i].Conditions+ "  ";
               resp_text += rows[i].Wind_dir_degrees.toString()+ "    ";
               resp_text += rows[i].DateUTC_year.toString()+"-";
               resp_text += rows[i].DateUTC_month.toString()+"-";
               resp_text += rows[i].DateUTC_day.toString()+"-";
               resp_text += rows[i].DateUTC_hour.toString()+":";
               resp_text += rows[i].DateUTC_minute.toString()+":";
               resp_text += rows[i].DateUTC_second.toString()+"\r\n";
              }
            }
            var message = "";
            if(resp_text != ""){
             message = "TimeMDT TemperatureF Dew_pointF Humidity " +
             "Sea_level_pressureIn VisibilityMPH Wind_direction " + "Wind_speedMP Gust_speedMP " +
             "PrecepitationIn Events Conditions Wind_dir_degrees DateUTC\n";
             }
            else {
               message = "Enter a valid DateUTC\n" + "Or check the database if it's empty.";
             }
              res.end( message + resp_text );
          } );
     }

     else if (req.url.indexOf( "data_add?" ) >= 0)
     {
       var kvf = getKeyValFromURL(req.url);
       //console.log(isNaN(70.7));
       if(isNaN(kvf[0])||isNaN(kvf[1])||isNaN(kvf[3])||isNaN(kvf[4])||
       isNaN(kvf[5])||isNaN(kvf[6])||isNaN(kvf[7])||isNaN(kvf[14])||
       isNaN(kvf[15])||isNaN(kvf[16])||isNaN(kvf[17])||isNaN(kvf[18])||
       isNaN(kvf[19])||isNaN(kvf[20]))
       {
         res.writeHead(200)
         res.end("Attempts failed.\n" + "Some columns are numeric,pls enter valid inputs.\n" +
         "You can't leave it empty except for Gust_speedMP, PrecepitationIn and Events.");
       }

       else if(!isNaN(kvf[2])||!isNaN(kvf[8])||!isNaN(kvf[13]) )
       {
         res.writeHead(200)
         res.end("Attempts failed\n" + "some columns are in text form,pls enter valid inputs.\n" +
         "You can't leave it empty except for Gust_speedMP, PrecepitationIn and Events.")
       }

       else{
           for(var i = 0; i < kvf.length; i++)
           {
             kvf[i] = "'"+ kvf[i] + "'";
           }
           var db = new sql.Database( 'weather.sqlite' );
           var test = "INSERT INTO weather_data VALUES(x)";
           var replace = test.replace(/x/g, kvf);
           db.each(replace);
           res.writeHead(200);
           res.end("Attempts Succeeded!")
        }
     }
     else {
       res.writeHead( 404 );
       res.end( "Cannot find file: "+fn );
     }
   }
}

var server = http.createServer( server_weather );
server.listen( 8080 );
