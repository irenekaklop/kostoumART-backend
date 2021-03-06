var db = require("./db.js");
var pool = db.getPool();

// constructor
const Costume = function(costume) {
    this.costume_name = costume.costume_name;
    this.description = costume.description;
    this.descriptionHtml = costume.descriptionHtml;
    this.date = costume.date;
    this.material = costume.material;
    this.technique = costume.technique;
    this.designer = costume.designer;
    this.actors = costume.actors;
    this.parts = costume.parts;
    this.sex = costume.sex;
    this.location = costume.location;
    this.useName = costume.useName;
    this.useCategory = costume.useCategory;
    this.theatricalPlayName = costume.theatricalPlayName;
    this.createdBy = costume.createdBy;
    this.images = costume.images;
};

Costume.create = (costume, result) => {
  pool.getConnection((err, conn) => {
    conn.query(
      `INSERT INTO costumes SET costume_name= ?, description= ?, descriptionHtml = ?,
      technique= ?, date= ?, sex= ?, material= ?, 
      actors= ?, location= ?, designer= ?, parts= ?, images = ?,
      useID= ( SELECT useID FROM uses WHERE name = ? AND use_category = ?), 
      theatrical_play_id = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = ?), 
      createdBy = (select user_id from users where username = ?)`, 
      [ costume.costume_name, costume.description, costume.descriptionHtml, costume.technique, costume.date,
        costume.sex, costume.material, costume.actors, costume.location, costume.designer, costume.parts,
        JSON.stringify(costume.images), costume.useName, costume.useCategory, costume.theatricalPlayName,
        costume.createdBy ],
      (err, res) => {
        if (err) {
          console.error("error: ", err);
          result(err, null);
          return;
        }
  
      console.log("created costume: ", { id: res.insertId });
      result(null, { id: res.insertId, ...costume });
      conn.release(); 
    });
  })
};
  
Costume.findById = (costumeId, result) => {
  pool.getConnection((err, conn) => {
    conn.query(`SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.descriptionHtml, costumes.images, costumes.useID, costumes.sex, uses.name as use_name, uses.use_category, costumes.material, costumes.technique,costumes.date, costumes.location, costumes.designer, costumes.theatrical_play_id, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes LEFT JOIN uses ON costumes.useID = uses.useID LEFT JOIN theatrical_plays ON costumes.theatrical_play_id=theatrical_plays.theatrical_play_id WHERE costume_id= ?`, [costumeId], (err, res) => {
      if (err) {
        console.error("Costume.findById: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found costume: ", costumeId);
        result(null, res[0]);
        return;
      }
  
      // not found Cosutme with the id
      result({ kind: "not_found" }, null);
      conn.release();
    });
  })
};
  
Costume.getAll = (AuthUser, result) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.descriptionHtml, costumes.images, costumes.date, 
      costumes.useID, costumes.sex, uses.name as use_name, uses.use_category, users.username as createdBy, costumes.material,
      costumes.technique, costumes.location, costumes.designer, costumes.theatrical_play_id, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes 
      JOIN (SELECT user_id FROM users where role <= ?) S2 ON costumes.createdBy = S2.user_id left join users on costumes.createdBy=users.user_id
      left join theatrical_plays on costumes.theatrical_play_id=theatrical_plays.theatrical_play_id left join uses ON costumes.useID = uses.useID`,
    [AuthUser],
    (err, res) => {
      if (err) {
        console.error("Costume.getAll ", err);
        result(null, err);
        return;
      }
      result(null, res);
      connection.release();
    });
  })
};
  
Costume.updateById = (id, costume, result) => {
  pool.getConnection((err, conn) => {
    conn.query(
      `UPDATE costumes SET costume_name=  ?, description= ?, 
      descriptionHtml = ?, date= ? , technique= ?, sex= ?, 
      material= ?, actors= ?, location= ?, designer= ?, images= ?,
      useID= ( SELECT useID FROM uses WHERE name = ? AND use_category = ?), 
      theatrical_play_id = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = ?),
      createdBy = (select user_id from users where username = ?)
      WHERE costume_id=?`,
      [costume.costume_name, costume.description, costume.descriptionHtml, costume.date, costume.technique, costume.sex,
        costume.material, costume.actors, costume.location, costume.designer, JSON.stringify(costume.images),
        costume.useName, costume.useCategory, costume.theatricalPlayName, costume.createdBy, id]
      ,
        (err, res) => {
          if (err) {
              console.error("Costume.updateById", err);
              result(null, err);
              return;
          }
    
          if (res.affectedRows == 0) {
            // not found Costume with the id
            result({ kind: "not_found" }, null);
            return;
          }
    
          console.log("updated costume: ", { id: id});
          result(null, { id: id, ...costume });
          conn.release();
        }
      );
  })
};
  
Costume.remove = (id, result) => {
  pool.getConnection((err, conn) => {
    conn.query("DELETE FROM costumes WHERE costume_id = ?", id, (err, res) => {
      if (err) {
        console.error("Costume.remove ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Costume with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted costume with id: ", id);
      result(null, res);
      conn.release();
    });
  })
};

module.exports = Costume;
