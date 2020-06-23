const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const cron = require("node-cron");
const db = require("./models/db.js");
const db_config = require('./config/db.config');
const mysqlBackup =  require('./database/database-backup.js');

var pool = db.getPool();

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth');
  res.header('Access-Control-Expose-Headers', 'x-auth');
  next();
});

app.use(cors());

// Express middleware that allows POSTing data
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// default route
app.get('/', function (req, res) {
    res.send('Hello from my api.');
});

// include routes
require("./routes/routes.js")(app);
require('./routes/users.routes')(app);

// schedule daily DB backup at 11pm
cron.schedule("* 23 * * *", function() {
  console.log("Daily back up of the database");
  mysqlBackup();
});

// set port, listen for requests
app.listen(8108, () => {
    console.log("Server is running on port 8108.");
});

// Find dependencies before delete

app.get('/dependencies', (req, res) => {
    let index = req.query.index;
    let column = req.query.column;
    let query;
    console.log(req.query);
    if(column==="use"){
      query= "SELECT (SELECT EXISTS (select * FROM costumes where useID=?)) OR (SELECT EXISTS (select * FROM accessories where useID=?)) as result"
      pool.getConnection((err, conn)=> {
        conn.query(query, [index, index],(err, results) => {
          if(err) throw err;
          res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
          conn.release();
        });
      })
    }
    else if (column==="theatrical_play"){
      query= "SELECT (SELECT EXISTS (select * FROM costumes where theatrical_play_id=?)) OR (SELECT EXISTS (select * FROM accessories where theatricalPlayId=?)) as result;"
      pool.getConnection((err, conn)=> {
        conn.query(query, [index, index],(err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        conn.release();
        });
      })
    }
    else if (column==='costume'){
      query = "SELECT EXISTS (select * FROM accessories where costumeId=?) as result;"
      pool.getConnection((err, conn)=> {
        conn.query(query, [index, index],(err, results) => {
          if(err) throw err;
          res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
          conn.release();
          });
      })
    }
   
});

//Check for dublicate by name
app.get('/checkDuplicate', (req, res) => {
  let query = '';
  if(req.query.item==='accessory'){
    query = "SELECT * FROM accessories WHERE name=?";
  }
  else if (req.query.item==='costume'){
    query = "SELECT * FROM costumes WHERE costume_name=?";
  }
  else if (req.query.item==='use'){
    query = "SELECT * FROM uses WHERE name=?";
  }
  else if (req.query.item==='theatrical_play'){
    query = "SELECT * FROM theatrical_plays WHERE title=?";
  }
  if (query === ''){
    throw 'Params incomplete'
  }
  pool.getConnection((err, conn)=> {
    conn.query(query, req.query.name, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      conn.release();
    });
  })
});

// Get Uploads

app.get('/uploads/images/:file', function (req, res) {
  res.sendFile(__dirname + '/uploads/images/' + req.params.file);
});