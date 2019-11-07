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
    password: 'culture123!',
    database: 'theaterdb'
});
  
// connect to database
dbConn.connect(); 
 
// default route
app.get('/', function (req, res) {
    res.send('Hello from my api.');
});

// fetch all costumes
app.post('/costumes', function (req, res) {
    dbConn.query("SELECT costumes.costume_name, costumes.description, costumes.sex, uses.name as use_name, costumes.material, costumes.technique, costumes.location, costumes.location_influence, costumes.designer, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes INNER JOIN uses ON costumes.useID = uses.useID INNER JOIN theatrical_plays ON costumes.theatrical_play_id=theatrical_plays.theatrical_play_id", function (error, results, fields){
        if(error) throw error;
        res.send(JSON.stringify(results))
    });
});

app.get('/costumes', function (req, res) {
    dbConn.query("SELECT costumes.costume_name, costumes.description, costumes.sex, uses.name as use_name, costumes.material, costumes.technique, costumes.location, costumes.location_influence, costumes.designer, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes INNER JOIN uses ON costumes.useID = uses.useID INNER JOIN theatrical_plays ON costumes.theatrical_play_id=theatrical_plays.theatrical_play_id", function (error, results, fields){
        if(error) throw error;
        res.send(JSON.stringify(results))
    });
}); 

module.exports = app;