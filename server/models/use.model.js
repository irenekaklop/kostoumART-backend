const db = require("./db.js");
var pool = db.getPool();

const Use = function(use) {
    this.name = use.name;
    this.use_category = use.use_category;
    this.description = use.description;
    this.descriptionHtml = use.descriptionHtml;
    this.customs = use.customs;
    this.userId = use.userId;
}

Use.create = (newUse, result) => {
  pool.getConnection((err, connection) => {
    connection.query( `INSERT INTO uses SET ?`, newUse, (err, res) => {
      if (err) {
        console.log("error::Use.create ", err);
        result(err, null);
        return;
      }
      console.log("created use: ", { id: res.insertId, ...newUse });
      result(null, { id: res.insertId, ...newUse });
      connection.release();
    });
  })
}

Use.findById = (useId, result) => {
  pool.getConnection((err, connection) => {
    connection.query(`SELECT * FROM uses WHERE useID= ${useId}`, (err, res) => {
      if (err) {
        console.log("error::Use.findById ", err);
        result(err, null);
        return;
      }
    
      if (res.length) {
        console.log("found use: ", res[0]);
        result(null, res[0]);
        return;
      }
    
      // not found Item with the id
      result({ kind: "not_found" }, null);
      connection.release();
    });
  })
};

Use.getAll = (AuthUser, result) => {
  pool.getConnection((err, connection) => {
    connection.query("SELECT *, users.username as createdBy FROM theaterdb.uses left join users on uses.userId=users.user_id;", (err, res) => {
      if (err) {
        console.log("error::Use.getAll ", err);
        result(null, err);
        return;
      }
      result(null, res);
      connection.release();
    });
  })
};

Use.updateById = (id, use, result) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `UPDATE uses SET ? WHERE useID=${id}`, use,
      (err, res) => {
        if (err) {
          console.log("error::Use.updateById ", err);
          result(null, err);
          return;
        }
    
        if (res.affectedRows == 0) {
          // not found Item with the id
          result({ kind: "not_found" }, null);
          return;
        }
    
        console.log("updated use: ", { id: id, ...use });
        result(null, { id: id, ...use });
        connection.release();
    });
  })
}

Use.remove = (id, result) => {
  pool.getConnection((err, connection) => {
    connection.query('DELETE FROM uses WHERE useID = ?', id, (err, res) => {
      if (err) {
        console.log("error::Use.remove ", err);
        result(null, err);
        return;
      }
    
      if (res.affectedRows == 0) {
        // not found Use with the id
        result({ kind: "not_found" }, null);
        return;
      }
    
      console.log("deleted use with id: ", id);
      result(null, res);
      connection.release();
    });
  })
};
  
module.exports = Use;
