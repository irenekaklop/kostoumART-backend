const sql = require("./db.js");

const Use = function(use) {
    this.name = use.name;
    this.use_category = use.use_category;
    this.description = use.description;
    this.customs = use.customs;
    this.userId = use.userId;
}

Use.create = (newUse, result) => {
  sql.query( `INSERT INTO uses SET ?`, newUse, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created use: ", { id: res.insertId, ...newUse });
    result(null, { id: res.insertId, ...newUse });
  });
}

Use.findById = (useId, result) => {
  sql.query(`SELECT * FROM uses WHERE useID= ${useId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
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
  });
};

Use.getAll = (AuthUser, result) => {
  sql.query("SELECT *, users.username as createdBy FROM theaterdb.uses left join users on uses.userId=users.user_id;", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
  
    console.log("uses: ", res);
    result(null, res);
  });
};

Use.updateById = (id, use, result) => {
  sql.query(
    `UPDATE uses SET ? WHERE useID=${id}`, use,
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
  
      console.log("updated use: ", { id: id, ...use });
      result(null, { id: id, ...use });
  });
}

Use.remove = (id, result) => {
  console.log(id)
  sql.query('DELETE FROM uses WHERE useID = ?', id, (err, res) => {
    if (err) {
      console.log("error: ", err);
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
  });
};
  
module.exports = Use;
