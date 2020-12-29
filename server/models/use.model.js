const db = require("./db.js");
var pool = db.getPool();

const Use = function(use) {
    this.name = use.name;
    this.use_category = use.use_category;
    this.description = use.description;
    this.descriptionHtml = use.descriptionHtml;
    this.customs = use.customs;
    this.createdBy = use.createdBy;
}

Use.create = (newUse, result) => {
  pool.getConnection((err, connection) => {
    connection.query( 'INSERT INTO uses SET name=?, description=?, use_category=?, customs=?, descriptionHtml=?, createdBy = (select user_id from users where username = ?)', 
    [newUse.name, newUse.description, newUse.use_category, newUse.customs, newUse.descriptionHtml, newUse.createdBy], 
    (err, res) => {
      if (err) {
        console.error("Use.create ", err);
        result(err, null);
        return;
      }
      console.log("created use: ", { id: res.insertId });
      result(null, { id: res.insertId, ...newUse });
      connection.release();
    });
  })
}

Use.findById = (useId, result) => {
  pool.getConnection((err, connection) => {
    connection.query(`SELECT * FROM uses WHERE useID= ${useId}`, (err, res) => {
      if (err) {
        console.error("Use.findById ", err);
        result(err, null);
        return;
      }
    
      if (res.length) {
        console.log("found use: ", useId);
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
    connection.query("SELECT *, users.username as createdBy FROM theaterdb.uses join (SELECT user_id FROM users where role <= ?) S2 ON uses.createdBy = S2.user_id left join users on uses.createdBy=users.user_id ", 
    [AuthUser],
    (err, res) => {
      if (err) {
        console.error("Use.getAll ", err);
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
      `UPDATE uses SET name=?, use_category=?, description=?, descriptionHTML=?, customs=?, 
      createdBy = (select user_id from users where username = ?) WHERE useID=?`, 
      [use.name, use.use_category, use.description, use.descriptionHtml, use.customs, use.createdBy, id],
      (err, res) => {
        if (err) {
          console.error("Use.updateById ", err);
          result(null, err);
          return;
        }
    
        if (res.affectedRows == 0) {
          // not found Item with the id
          result({ kind: "not_found" }, null);
          return;
        }
    
        console.log("updated use: ", { id: id });
        result(null, { id: id, ...use });
        connection.release();
    });
  })
}

Use.remove = (id, result) => {
  pool.getConnection((err, connection) => {
    connection.query('DELETE FROM uses WHERE useID = ?', id, (err, res) => {
      if (err) {
        console.error("Use.remove ", err);
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
