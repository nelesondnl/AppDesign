var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

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

function addStudent( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var sid = kvs['sid'];
    var name = kvs[ 'name' ];
    var sandwich = kvs[ 'sandwich' ];
    db.run( "INSERT INTO Students VALUES (?, ?, ? )", sid, name, sandwich,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added student" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addTeacher( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var tid = kvs['tid'];
    var name = kvs[ 'name' ];
    db.run( "INSERT INTO Teachers VALUES (?, ? )", tid, name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added teacher" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addCourse( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var cid = kvs['cid'];
    var name = kvs[ 'name' ];
    db.run( "INSERT INTO Courses VALUES (?, ? )", cid, name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added course" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addEnroll( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var student = kvs['stu'];
    var classname = kvs[ 'class' ];
    db.run( "INSERT INTO Enrollments VALUES (?, ? )", student, classname,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added enrollment" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addAssign( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var teacher = kvs['tea'];
    var classname = kvs[ 'class' ];
    db.run( "INSERT INTO TeachingAssignments VALUES (?, ? )", teacher, classname,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "Added teaching assignment" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function server_fun( req, res )
{
    console.log( "The URL: '", req.url, "'" );
    // ...
    if( req.url === "/" || req.url === "/index.htm" )
    {
        req.url = "/index.html";
    }
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp ) {
        if( req.url.indexOf( "add_student?" ) >= 0 )
        {
            addStudent( req, res );
        }
        else if (req.url.indexOf( "add_teachers?" ) >= 0)
        {
            addTeacher(req, res);
        }
        else if (req.url.indexOf( "add_courses?" ) >= 0)
        {
            addCourse(req, res);
        }
        else if (req.url.indexOf( "add_enroll?" ) >= 0)
        {
            addEnroll(req, res);
        }
        else if (req.url.indexOf( "add_teaching?" ) >= 0)
        {
            addAssign(req, res);
        }
        else if (req.url.indexOf( "student_table?" ) >= 0)
        {
          var db = new sql.Database('registrar.sqlite');
          db.all('SELECT * FROM Students', function(err, rows)
         {
           if( err )
           {
               console.log( err );
               res.writeHead(200);
               res.end("Error Occurs");
           }
           else{
             res.writeHead(200);
             var resp_text = "<html><body><table><tbody>";
             for(var i = 0; i < rows.length; i++)
             {
               resp_text += "<tr><td>" + rows[i].sid + "</td><td>"
               + rows[i].Name + "</td><td>" + rows[i].SandwichPreference +
               "</td></tr>";
             }
             resp_text += "</tbody></table></body></html>";
             res.end(resp_text);
           }
         })
        }

        else if (req.url.indexOf( "teacher_table?" ) >= 0)
        {
          var db = new sql.Database('registrar.sqlite');
          db.all('SELECT * FROM Teachers', function(err, rows)
         {
           if( err )
           {
               console.log( err );
               res.writeHead(200);
               res.end("Error Occurs");
           }
           else{
             res.writeHead(200);
             var resp_text = "<html><body><table><tbody>";
             for(var i = 0; i < rows.length; i++)
             {
               resp_text += "<tr><td>" + rows[i].tid + "</td><td>"
               + rows[i].Name + "</td></tr>";
             }
             resp_text += "</tbody></table></body></html>";
             res.end(resp_text);
           }
         })
        }

        else if (req.url.indexOf( "course_table?" ) >= 0)
        {
          var db = new sql.Database('registrar.sqlite');
          db.all('SELECT * FROM Courses', function(err, rows)
         {
           if( err )
           {
               console.log( err );
               res.writeHead(200);
               res.end("Error Occurs");
           }
           else{
             res.writeHead(200);
             var resp_text = "<html><body><table><tbody>";
             for(var i = 0; i < rows.length; i++)
             {
               resp_text += "<tr><td>" + rows[i].cid + "</td><td>"
               + rows[i].Name + "</td></tr>";
             }
             resp_text += "</tbody></table></body></html>";
             res.end(resp_text);
           }
         })
        }

        else if (req.url.indexOf( "enroll_table?" ) >= 0)
        {
          var db = new sql.Database('registrar.sqlite');
          db.all('SELECT * FROM Enrollments', function(err, rows)
         {
           if( err )
           {
               console.log( err );
               res.writeHead(200);
               res.end("Error Occurs");
           }
           else{
             res.writeHead(200);
             var resp_text = "<html><body><table><tbody>";
             for(var i = 0; i < rows.length; i++)
             {
               resp_text += "<tr><td>" + rows[i].student + "</td><td>"
               + rows[i].class + "</td></tr>";
             }
             resp_text += "</tbody></table></body></html>";
             res.end(resp_text);
           }
         })
        }

        else if (req.url.indexOf( "assign_table?" ) >= 0)
        {
          var db = new sql.Database('registrar.sqlite');
          db.all('SELECT * FROM TeachingAssignments', function(err, rows)
         {
           if( err )
           {
               console.log( err );
               res.writeHead(200);
               res.end("Error Occurs");
           }
           else{
             res.writeHead(200);
             var resp_text = "<html><body><table><tbody>";
             for(var i = 0; i < rows.length; i++)
             {
               resp_text += "<tr><td>" + rows[i].teacher + "</td><td>"
               + rows[i].class + "</td></tr>";
             }
             resp_text += "</tbody></table></body></html>";
             res.end(resp_text);
           }
         })
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
