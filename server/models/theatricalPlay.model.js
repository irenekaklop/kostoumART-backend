const sql = require("./db.js");

const TheatricalPlay = function (theatricalPlay) {
    this.title = theatricalPlay.title;
    this.director = theatricalPlay.director;
    this.theater = theatricalPlay.theater;
    this.date = theatricalPlay.date;
    this.actors = theatricalPlay.actors;
    this.userId = theatricalPlay.userId;
}

TheatricalPlay.create = (newTheatricalPlay, result) => {
    sql.query( `INSERT INTO theatrical_plays SET ?`, newTheatricalPlay, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        console.log("created theatrical play: ", { id: res.insertId, ...newTheatricalPlay });
        result(null, { id: res.insertId, ...newTheatricalPlay });
    });
}

TheatricalPlay.findById = (theatricalPlayId, result) => {
    sql.query(`SELECT * FROM theatrical_plays WHERE theatrical_play_id= ${theatricalPlayId}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
      
        if (res.length) {
          console.log("found theatrical play: ", res[0]);
          result(null, res[0]);
          return;
        }
      
        // not found Item with the id
        result({ kind: "not_found" }, null);
    });
}

TheatricalPlay.getAll = (AuthUser, result) => {
    sql.query("SELECT *, users.username as createdBy FROM theatrical_plays left join users on theatrical_plays.userId=users.user_id;", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
      
        console.log("theatrical plays: ", res);
        result(null, res);
    });
}

TheatricalPlay.updateById = (id, theatricalPlay, result) => {
    sql.query(
        `UPDATE theatrical_plays SET ? WHERE theatrical_play_id=${id}`, theatricalPlay,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
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
      });
}

TheatricalPlay.remove = (id, result) => {
    sql.query('DELETE FROM theatrical_plays WHERE theatrical_play_id = ?', id, (err, res) => {
        if (err) {
          console.log("error: ", err);
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
      });
}

module.exports = TheatricalPlay;