var express = require('express'), http = require('http'), mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth');
    res.header('Access-Control-Expose-Headers', 'x-auth');
    next();
});

// set port
app.listen(8108, function () {
    console.log('Node app is running on port 8108');
});

// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'eirini',
    password: 'e1r1n1',
    database: 'theaterdb'
});

// connect to database
dbConn.connect();

// default route
app.get('/', function (req, res) {
    res.send('Hello from my api.');
});

/*COSTUMES*/

//show all costumes
app.get('/costumes',(req, res) => {
    let sql = "SELECT costumes.costume_name, costumes.description, costumes.sex, uses.name as use_name, costumes.material, costumes.technique, costumes.location, costumes.location_influence, costumes.designer, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes INNER JOIN uses ON costumes.useID = uses.useID LEFT JOIN theatrical_plays ON costumes.theatrical_play_id=theatrical_plays.theatrical_play_id";
    let query =  dbConn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });
   
//show single costume
app.get('/costumes/:id', (req, res) => {
    let sql = "SELECT * FROM costumes WHERE costume_id="+req.params.id;
    let query = dbConn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

//add new costume
app.post('/costumes',(req, res) => {
    let data ={costume_name: req.body.name, description: req.body.descr, use_name: req.body.u_value, technique: req.body.t_value, sex: req.body.s_value, material: req.body.m_value,
        actors: req.body.actors, location: req.body.location, location_influence: req.body.location_influence,
        designer: req.body.designer, theatrical_play: req.body.tp_value, parts: req.body.parts  };
    console.log(data);
    let sql = "INSERT INTO costumes SET costume_name= '"+data.costume_name+"', description= '"+data.description+"', technique= '"+data.technique+"', sex= '"+data.sex+"', material= '"+data.material+"', actors= '"+data.actors+"', location= '"+data.location+"', location_influence= '"+data.location_influence+"', designer= '"+data.designer+"', parts= '"+data.parts+"', useID= ( SELECT useID FROM uses WHERE name = '"+data.use_name+"'), theatrical_play_id = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '"+data.theatrical_play+"')";
    let query = dbConn.query(sql, data, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//delete costume
app.delete('/costumes', function (req, res) {
   console.log(req);
   let sql = 'DELETE FROM costumes WHERE costume_name = ?';
   let query = dbConn.query(sql, [req.query.name], function (error, results, fields) {
	  if (error) throw error;
	  res.send('Record has been deleted!');
	});
});

/*USES*/
//show all uses
app.get('/uses',(req, res) => {
    let sql = "SELECT * FROM uses";
    let query =  dbConn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

//add new use
app.post('/uses', (req, res) => {
    console.log("insert use", req);
    let data ={name: req.body.name, use_category: req.body.category, description: req.body.description, customs: req.body.customs};
    let sql = "INSERT INTO uses SET ?";
    let query = dbConn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//delete use
app.delete('/uses', function (req, res) {
  console.log(req.body);
  let sql = 'DELETE FROM uses WHERE id = ?';
  dbConn.query(sql , [req.body.id], function (error, results, fields) {
   if (error) throw error;
   res.end('Record has been deleted!');
 });
});

/*THEATRICAL PLAYS*/

//show all theatrical plays
app.get('/tps',(req, res) => {
    let sql = "SELECT * FROM theatrical_plays";
    let query =  dbConn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//add new theatrical play
app.post('/tps', (req, res) => {
    let data ={title: req.body.title, date: req.body.date, actors: req.body.actors, director: req.body.director, theater: req.body.theater};
    let sql = "INSERT INTO theatrical_plays SET ?";
    let query = dbConn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//delete use
app.delete('/tps', function (req, res) {
  console.log(req.body);
  let sql = 'DELETE FROM theatrical_plays WHERE id = ?';
  dbConn.query(sql, [req.body.id], function (error, results, fields) {
   if (error) throw error;
   res.end('Record has been deleted!');
 });
});

module.exports = app;
