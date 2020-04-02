const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connectionConfig = {
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database
};

const connection; 

function handleConnection() {
  connection = mysql.createConnection(connectionConfig); // Recreate the connection, since
                                                        // the old one cannot be reused.

  connection.connect(function(err) {           // The server is either down
    if(err) {                                 // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleConnection, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to                                    // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
    else{
      console.log("Successfully connected to the database.");
    }       
  });                             
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleConnection();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleConnection();

module.exports = connection;