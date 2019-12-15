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
    user: 'root',
    password: '',
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
    let sql = "SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.useID, costumes.sex, uses.name as use_name, costumes.material, costumes.technique, costumes.location, costumes.location_influence, costumes.designer, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes LEFT JOIN uses ON costumes.useID = uses.useID LEFT JOIN theatrical_plays ON costumes.theatrical_play_id=theatrical_plays.theatrical_play_id";
    let query =  dbConn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });
   
//show single costume
app.get('/costumes/:id', (req, res) => {
    let sql = "SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.useID, costumes.sex, uses.name as use_name, costumes.material, costumes.technique, costumes.location, costumes.location_influence, costumes.designer, costumes.theatrical_play_id, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes LEFT JOIN uses ON costumes.useID = uses.useID LEFT JOIN theatrical_plays ON costumes.theatrical_play_id=theatrical_plays.theatrical_play_id WHERE costume_id="+req.params.id;
    let query = dbConn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

//add new costume
app.post('/costumes',(req, res) => {
    let data ={costume_name: req.body.name, description: req.body.descr, use_name: req.body.selectedUseOption, technique: req.body.selectedTechniqueOption, sex: req.body.selectedSexOption,
        material: req.body.selectedMaterialOption,
        actors: req.body.actors, location: req.body.location, location_influence: req.body.location_influence,
        designer: req.body.designer, theatrical_play: req.body.selectedTPOption, parts: req.body.parts  };
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

//update costume
app.post('/edit_costume', function (req, res){
  let data = {costume_id: req.body.costume_id, costume_name: req.body.name, description: req.body.descr, use_name: req.body.selectedUseOption, technique: req.body.selectedTechniqueOption,
    sex: req.body.selectedSexOption,
    material: req.body.selectedMaterialOption,
    actors: req.body.actors, location: req.body.location, location_influence: req.body.location_influence,
    designer: req.body.designer, theatrical_play: req.body.selectedTPOption, parts: req.body.parts};
  console.log(data);
  let sql = "UPDATE costumes SET costume_name= '"+data.costume_name+"', description= '"+data.description+"', technique= '"+data.technique+"', sex= '"+data.sex+"', material= '"+data.material+"', actors= '"+data.actors+"', location= '"+data.location+"', location_influence= '"+data.location_influence+"', designer= '"+data.designer+"', parts= '"+data.parts+"', useID= ( SELECT useID FROM uses WHERE name = '"+data.use_name+"'), theatrical_play_id = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '"+data.theatrical_play+"') WHERE costume_id="+data.costume_id;
  dbConn.query(sql, data, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  })
})

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
    let data = {name: req.body.name, use_category: req.body.category, description: req.body.description, customs: req.body.customs};
    let sql = "INSERT INTO uses SET ?";
    let query = dbConn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//show single use
app.get('/uses/:id', (req, res) => {
  let sql = "SELECT * FROM uses WHERE useID="+req.params.id;
  let query = dbConn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//delete use
app.delete('/uses', function (req, res) {
  console.log(req);
  let sql = 'DELETE FROM uses WHERE useID = ?';
  dbConn.query(sql , [req.query.id], function (error, results, fields) {
   if (error) throw error;
   res.end('Record has been deleted!');
 });
});

//update use
app.post('/edit_use', function (req, res){
  let data = {useID: req.body.id, name: req.body.name, use_category: req.body.category, description: req.body.description, customs: req.body.customs};
  console.log(data);
  let sql = "UPDATE uses SET ? WHERE useID="+data.useID;
  dbConn.query(sql, data, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  })
})

/*THEATRICAL PLAYS*/

//show all theatrical plays
app.get('/tps',(req, res) => {
    let sql = "SELECT * FROM theatrical_plays";
    let query =  dbConn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//show single tp
app.get('/tps/:id', (req, res) => {
  let sql = "SELECT * FROM theatrical_plays WHERE theatrical_play_id="+req.params.id;
  let query = dbConn.query(sql, (err, results) => {
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

//delete theatrical play
app.delete('/tps', function (req, res) {
  console.log(req.query);
  let sql = 'DELETE FROM theatrical_plays WHERE theatrical_play_id = ?';
  dbConn.query(sql, [req.query.id], function (error, results, fields) {
   if (error) throw error;
   res.end('Record has been deleted!');
 });
});


//update costume
app.post('/edit_tp', function (req, res){
  let data ={theatrical_play_id: req.body.theatrical_play_id, title: req.body.title, date: req.body.date, actors: req.body.actors, director: req.body.director, theater: req.body.theater};
  console.log(data);
  let sql = "UPDATE theatrical_plays SET ? WHERE theatrical_play_id="+data.theatrical_play_id;
  dbConn.query(sql, data, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  })
})

//Users
//show all users
app.get('/users',(req, res) => {
  let sql = "SELECT * FROM users";
  let query =  dbConn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.post('/login', (req, res) => {
  let userData = {email: req.body.email, password: req.body.password};
  console.log(userData);
  let sql = "SELECT * FROM users WHERE email='"+userData.email+"'AND password='"+userData.password+"'";
  dbConn.query(sql,  userData, (error, results) => {
    if (error) throw error;
    
    results = JSON.stringify(results);
    results = JSON.parse(results);
    results = results[0];

    console.log("LOGIN", results);

    if(!results){
      console.log("error")
      return res.status(401).send({
        message:"User not verified."
      });
    }
    return res.status(200).send(results);
  });
});

module.exports = app;