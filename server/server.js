var express = require('express'), http = require('http');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var Users = require('./routes/Users');

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.json());
app.use(cors());
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

// set port for our application
app.listen(8108, function () {
    console.log('Node app is running on port 8108');
});

app.use('/users', Users)

// connection configurations
var dbConfig = {
  host: 'localhost',
  user: 'eirini',
  password: 'e1r1n1',
  database: 'theaterdb'
}

var dbConn;

function handleDisconnect() {
  dbConn = mysql.createConnection(dbConfig);  // Recreate the connection, since
                                              // the old one cannot be reused.

  dbConn.connect(function(err) {              // The server is either down
    if(err) {                                 // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  dbConn.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

// default route
app.get('/', function (req, res) {
    res.send('Hello from my api.');
});

/*COSTUMES*/

//show all costumes
app.get('/costumes', (req, res) => {
  let AuthUser = req.query.user;
  console.log("AuthUser", AuthUser);
  let sql = "SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.date, costumes.useID, costumes.sex, uses.name as use_name, costumes.userId as costumeCreator, costumes.material, costumes.technique, costumes.location, costumes.location_influence, costumes.designer, costumes.theatrical_play_id, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes JOIN (SELECT user_id FROM users where role <= '"+AuthUser+"') S2 ON costumes.userId = S2.user_id left join theatrical_plays on costumes.theatrical_play_id=theatrical_plays.theatrical_play_id left join uses ON costumes.useID = uses.useID;";
  let query =  dbConn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });
   
//show single costume
app.get('/costumes/:id', (req, res) => {
    let sql = "SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.useID, costumes.sex, uses.name as use_name, costumes.material, costumes.technique,costumes.date, costumes.location, costumes.location_influence, costumes.designer, costumes.theatrical_play_id, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes LEFT JOIN uses ON costumes.useID = uses.useID LEFT JOIN theatrical_plays ON costumes.theatrical_play_id=theatrical_plays.theatrical_play_id WHERE costume_id="+req.params.id;
    let query = dbConn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

//add new costume
app.post('/costumes',(req, res) => {
  let sexs='';
  for(var i=0; i < req.body.selectedSexOption.length; i++){
    sexs = sexs+req.body.selectedSexOption[i].value;
    if(i != req.body.selectedSexOption.length-1){
      sexs=sexs+','
    }
  }  
  let data ={costume_name: req.body.name, description: req.body.descr, use_name: req.body.selectedUseOption.value, useCategory: req.body.selectedUseOption.category, 
    technique: req.body.selectedTechniqueOption.value, sex: sexs, material: req.body.selectedMaterialOption.value, date:  req.body.selectedDateOption.value,
    actors: req.body.actors, location: req.body.location,
    designer: req.body.designer, theatrical_play: (req.body.selectedTPOption ? req.body.selectedTPOption.value : null ), parts: req.body.parts, userId: req.body.user_id  };
  console.log("insert costume", data);
  let sql = "INSERT INTO costumes SET costume_name= '"+data.costume_name+"', description= '"+data.description+"', technique= '"+data.technique+"', date=  "+data.date+",sex= '"+data.sex+"', material= '"+data.material+"', actors= '"+data.actors+"', location= '"+data.location+"', location_influence= '"+data.location_influence+"', designer= '"+data.designer+"', parts= '"+data.parts+"', useID= ( SELECT useID FROM uses WHERE name = '"+data.use_name+"' AND use_category = '"+data.useCategory+"'), theatrical_play_id = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '"+data.theatrical_play+"'), userId = '"+data.userId+"'";
    console.log(sql)
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
  let sexs='';
  for(var i=0; i < req.body.selectedSexOption.length; i++){
    sexs = sexs+req.body.selectedSexOption[i].value;
    if(i != req.body.selectedSexOption.length-1){
      sexs=sexs+','
    }
  }  
  let data = {costume_id: req.body.costume_id, costume_name: req.body.name, description: req.body.descr, use_name: req.body.selectedUseOption.value, 
    technique: req.body.selectedTechniqueOption.value, material: req.body.selectedMaterialOption.value, theatrical_play: (req.body.selectedTPOption ? req.body.selectedTPOption.value : null ),
    sex: sexs,
    date: req.body.selectedDateOption.value,
    actors: req.body.actors, location: req.body.location,
    designer: req.body.designer,  parts: req.body.parts};
  console.log("update costume", data);
  let sql = "UPDATE costumes SET costume_name= '"+data.costume_name+"', description= '"+data.description+"', date="+data.date+" , technique= '"+data.technique+"', sex= '"+data.sex+"', material= '"+data.material+"', actors= '"+data.actors+"', location= '"+data.location+"', location_influence= '"+data.location_influence+"', designer= '"+data.designer+"', parts= '"+data.parts+"', useID= ( SELECT useID FROM uses WHERE name = '"+data.use_name+"'), theatrical_play_id = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '"+data.theatrical_play+"') WHERE costume_id="+data.costume_id;
  console.log(sql)
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
    console.log("insert use", req);
    let data ={name: req.body.name, use_category: req.body.category, description: req.body.description, customs: req.body.customs, useId: req.body.useId};
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
    let data ={title: req.body.title, date: req.body.date, actors: req.body.actors, director: req.body.director, theater: req.body.theater, userId: req.body.userId};
    console.log(data);
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

//update theatrical play
app.post('/edit_tp', function (req, res){
  let data ={theatrical_play_id: req.body.theatrical_play_id, title: req.body.title, date: req.body.date, actors: req.body.actors, director: req.body.director, theater: req.body.theater, userId: req.body.userId};
  console.log(data);
  let sql = "UPDATE theatrical_plays SET ? WHERE theatrical_play_id="+data.theatrical_play_id;
  dbConn.query(sql, data, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  })
})

/*Accessories*/

//Show all accessories

app.get('/accessories', (req, res) => {
  let AuthUser = req.query.user;
  console.log("AuthUser", AuthUser);
  let sql = "SELECT accessory_id, accessories.name, accessories.description, accessories.date, accessories.sex, accessories.material, accessories.technique, accessories.location, accessories.designer, accessories.parts, accessories.actors, costumeId, accessories.useId, accessories.userId, uses.name as use_name, costumes.costume_name, uses.use_category FROM accessories JOIN (SELECT user_id FROM theaterdb.users where role <= '"+AuthUser+"') S2 ON accessories.userId = S2.user_id left join theatrical_plays ON accessories.theatricalPlayId = theatrical_play_id left join uses ON accessories.useId = uses.useID left join costumes ON accessories.costumeId=costumes.costume_id;";
  let query =  dbConn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });
  
//show single accessory
app.get('/accessories/:id', (req, res) => {
  let sql = "SELECT accessories.accessory_id, accessories.name, accessories.description, accessories.useId, accessories.sex, uses.name as use_name, accessories.material, accessories.technique, accessories.date, accessories.location, accessories.designer, accessories.theatricalPlayId, theatrical_plays.title as tp_title, accessories.parts, accessories.actors,  costumes.costume_name FROM accessories LEFT JOIN costumes ON accessories.costumeId = costumes.costume_id LEFT JOIN uses ON accessories.useId = uses.useID LEFT JOIN theatrical_plays ON accessories.theatricalPlayId=theatrical_plays.theatrical_play_id WHERE accessory_id="+req.params.id;
  let query = dbConn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//update
app.post('/editAccessory', function (req, res){
  let sql;
  let sexs='';
  for(var i=0; i < req.body.selectedSexOption.length; i++){
    sexs = sexs+req.body.selectedSexOption[i].value;
    if(i != req.body.selectedSexOption.length-1){
      sexs=sexs+','
    }
  }  
  let data ={
    accessory_id: req.body.accessory_id,
    accessory_name: req.body.name, description: req.body.description, 
    use_name: req.body.selectedUseOption.value, useCategory: req.body.selectedUseOption.category, 
    technique: req.body.selectedTechniqueOption.value, sex: sexs,
    material: req.body.selectedMaterialOption.value,
    date:  req.body.selectedDateOption.value,
    actors: (req.body.actors? req.body.actors : ""), 
    location: (req.body.location ? req.body.location : ''),
    costume_name: (req.body.selectedCostumeOption? req.body.selectedCostumeOption.value : null),
    designer: (req.body.designer? req.body.designer : ""), 
    theatrical_play: (req.body.selectedTPOption? selectedTPOption.value : null ), parts: (req.body.parts ? req.body.parts : ''), 
    userId: req.body.user_id  };
  console.log(data);
      sql = "UPDATE accessories SET name= '"+data.accessory_name+"', description= '"+data.description+"', date="+data.date+" , technique= '"+data.technique+"', sex= '"+data.sex+"', material= '"+data.material+"', actors= '"+data.actors+"', location= '"+data.location+"', designer= '"+data.designer+"', parts= '"+data.parts+"', useId= ( SELECT useID FROM uses WHERE name = '"+data.use_name+"'), costumeId = (SELECT costume_id FROM costumes WHERE costume_name = '"+data.costume_name+"'), theatricalPlayId = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '"+data.theatrical_play+"') WHERE accessory_id="+data.accessory_id;
      dbConn.query(sql, data, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      })
})

app.post('/accessory', (req, res) => {
  let sexs='';
  for(var i=0; i < req.body.selectedSexOption.length; i++){
    sexs = sexs+req.body.selectedSexOption[i].value;
    if(i != req.body.selectedSexOption.length-1){
      sexs=sexs+','
    }
  }  
  let data ={
    accessory_name: req.body.name, description: req.body.description, 
    use_name: req.body.selectedUseOption.value, useCategory: req.body.selectedUseOption.category, 
    technique: req.body.selectedTechniqueOption.value, sex: sexs,
    material: req.body.selectedMaterialOption.value,
    date:  req.body.selectedDateOption.value,
    actors: (req.body.actors? req.body.actors : ""), 
    location: (req.body.location ? req.body.location : ''),
    costume_name: (req.body.selectedCostumeOption? req.body.selectedCostumeOption.value : null),
    designer: (req.body.designer? req.body.designer : ""), 
    theatrical_play: (req.body.selectedTPOption? selectedTPOption.value : null ), parts: (req.body.parts ? req.body.parts : ''), 
    userId: req.body.user_id  };
  console.log("insert accessory", data);
  let sql = "INSERT INTO accessories SET name= '"+data.accessory_name+"', description= '"+data.description+"', technique= '"+data.technique+"', date=  "+data.date+",sex= '"+data.sex+"', material= '"+data.material+"', actors= '"+data.actors+"', location= '"+data.location+"', designer= '"+data.designer+"', parts= '"+data.parts+"', useId= ( SELECT useID FROM uses WHERE name = '"+data.use_name+"' AND use_category = '"+data.useCategory+"'), costumeId = (SELECT costume_id FROM costumes WHERE costume_name = '"+data.costume_name+"'), theatricalPlayId = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '"+data.theatrical_play+"'), userId = '"+data.userId+"'";
  dbConn.query(sql, data, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  })
});

app.delete('/accessory', function (req, res) {
  console.log(req.query);
  let sql = 'DELETE FROM accessories WHERE accessory_id = ?';
  dbConn.query(sql, [req.query.id], function (error, results, fields) {
   if (error) throw error;
   res.end('Record has been deleted!');
 });
});

module.exports = app;

