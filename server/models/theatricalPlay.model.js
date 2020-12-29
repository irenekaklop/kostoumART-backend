const db = require("./db.js");
var pool = db.getPool();

const TheatricalPlay = function (theatricalPlay) {
    this.title = theatricalPlay.title;
    this.director = theatricalPlay.director;
    this.theater = theatricalPlay.theater;
    this.years = theatricalPlay.years;
    this.actors = theatricalPlay.actors;
    this.createdBy = theatricalPlay.createdBy;
}

TheatricalPlay.create = (newTheatricalPlay, result) => {
  pool.getConnection((err, connection) => {
    connection.query( `INSERT INTO theatrical_plays SET title=?, years=?, actors=?, director=?, theater=?, createdBy=(select user_id from users where username = ?)`,
    [newTheatricalPlay.title, newTheatricalPlay.years, newTheatricalPlay.actors, newTheatricalPlay.director, newTheatricalPlay.theater, newTheatricalPlay.createdBy], (err, res) => {
        if (err) {
          console.error("TheatricalPlay.create ", err);
          result(err, null);
          return;
        }
        console.log("created theatrical play: ", { id: res.insertId });
        result(null, { id: res.insertId, ...newTheatricalPlay });
        connection.release();
    });
  })
}

TheatricalPlay.findById = (theatricalPlayId, result) => {
  pool.getConnection((err, connection) => {
    connection.query(`SELECT * FROM theatrical_plays WHERE theatrical_play_id= ${theatricalPlayId}`, (err, res) => {
        if (err) {
          console.error("TheatricalPlay.findById ", err);
          result(err, null);
          return;
        }
      
        if (res.length) {
          console.log("found theatrical play: ", theatricalPlayId);
          result(null, res[0]);
          return;
        }
      
        // not found Item with the id
        result({ kind: "not_found" }, null);

        connection.release();
    });
  })
}

TheatricalPlay.getAll = (AuthUser, result) => {
  pool.getConnection((err, connection) => {
    connection.query("SELECT *, users.username as createdBy FROM theatrical_plays join (SELECT user_id FROM users where role <= ?) S2 ON theatrical_plays.createdBy = S2.user_id left join users on theatrical_plays.createdBy=users.user_id",
    [AuthUser],
    (err, res) => {
        if (err) {
          console.error("TheatricalPlay.getAll ", err);
          result(null, err);
          return;
        }
        result(null, res);
        connection.release();
    });
  })
}

TheatricalPlay.updateById = (id, theatricalPlay, result) => {
  pool.getConnection((err, connection) => {
    connection.query(
        `UPDATE theatrical_plays SET title=?, years=?, actors=?, director=?, theater=?,
        createdBy = (select user_id from users where username = ?) WHERE theatrical_play_id=?`, 
        [theatricalPlay.title, theatricalPlay.years, theatricalPlay.actors, theatricalPlay.director, theatricalPlay.theater, theatricalPlay.createdBy, id],
        (err, res) => {
          if (err) {
            console.error("TheatricalPlay.updateById ", err);
            result(null, err);
            return;
          }
      
          if (res.affectedRows == 0) {
            // not found Item with the id
            result({ kind: "not_found" }, null);
            return;
          }
      
          console.log("updated theatrical play: ", { id: id, ...theatricalPlay });
          result(null, { id: id, ...theatricalPlay });
          connection.release();
      });
    })
}

TheatricalPlay.remove = (id, result) => {
  pool.getConnection((err, connection) => {
    connection.query('DELETE FROM theatrical_plays WHERE theatrical_play_id = ?', id, (err, res) => {
        if (err) {
          console.error("TheatricalPlay.remove ", err);
          result(null, err);
          return;
        }
      
        if (res.affectedRows == 0) {
          // not found TP with the id
          result({ kind: "not_found" }, null);
          return;
        }
      
        console.log("deleted theatrical play with id: ", id);
        result(null, res);
        connection.release();
      });
    })
}

module.exports = TheatricalPlay;