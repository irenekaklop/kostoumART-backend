const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("./models/db");

const app = express();

// Express middleware that allows POSTing data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// default route
app.get('/', function (req, res) {
    res.send('Hello from my api.');
});

// include routes
require("./routes/routes.js")(app);
var Users = require('./routes/users.routes');
app.use('/users', Users);

const db = require("./models");

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
      sql.query(query, [index, index],(err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      });
    }
    else if (column==="theatrical_play"){
      query= "SELECT (SELECT EXISTS (select * FROM costumes where theatrical_play_id=?)) OR (SELECT EXISTS (select * FROM accessories where theatricalPlayId=?)) as result;"
      sql.query(query, [index, index],(err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      });
    }
    else if (column==='costume'){
      query = "SELECT EXISTS (select * FROM accessories where costumeId=?) as result;"
      sql.query(query, [index],(err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      });
    }
   
});

//Check for dublicate by name
app.get('/checkDuplicate', (req, res) => {
  let query = '';
  if(req.query.item==='accessory'){
    query = "SELECT * FROM accessories WHERE name='"+req.query.name+"'";
  }
  else if (req.query.item==='costume'){
    query = "SELECT * FROM costumes WHERE costume_name='"+req.query.name+"'";
  }
  else if (req.query.item==='use'){
    query = "SELECT * FROM uses WHERE name='"+req.query.name+"'";
  }
  else if (req.query.item==='theatrical_play'){
    query = "SELECT * FROM theatrical_plays WHERE title='"+req.query.name+"'";
  }
  if (query === ''){
    throw 'Params incomplete'
  }
  sql.query(query, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
