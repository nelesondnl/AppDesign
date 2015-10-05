var fs = require('fs');
var sql = require('sqlite3').verbose();

function readWeatherData()
{
   var filename = "weather_data.csv";
   var data_content = fs.readFileSync(filename).toString();
   var data_content_line = data_content.split('\r\n');
   //console.log(data_content_line);
   var data_content_useful = [];
   for(var i = 1; i < data_content_line.length-1; i++)
   {
     data_content_useful[i-1] = data_content_line[i];
   }
   //console.log(data_content_useful.length);
   var seperate_data = [];
   for(var i = 0; i < data_content_useful.length; i++)
   {
     var split_line = data_content_useful[i].split(',');
     var split_start = split_line[0].split(/[\:,\s]/);
     var split_end = split_line[split_line.length-1].split(/[\-,\s,\:]/);
     split_line.splice(0,1,split_start[0],split_start[1],split_start[2]);
     split_line.splice(split_line.length-1,1,split_end[0],split_end[1],split_end[2],
     split_end[3],split_end[4],split_end[5]);
     seperate_data.push(split_line);
    }

    for(var i = 0; i < seperate_data.length; i++)
    {
      for(var j = 0; j < seperate_data[0].length; j++)
      {
        seperate_data[i][j] = "'" + seperate_data[i][j] + "'";
      }
    }
    return seperate_data;
}

function insertData()
{
  var sort_data = readWeatherData();
  //console.log(sort_data);
  var db = new sql.Database( 'weather.sqlite' );
  for (var i = 0; i < sort_data.length; i++)
  {
    var test = "INSERT INTO weather_data VALUES(x)";
    var replace = test.replace(/x/g,sort_data[i]);
    //console.log(replace);
    db.each(replace);
  }
}

insertData();
