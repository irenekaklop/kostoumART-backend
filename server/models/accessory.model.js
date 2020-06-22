var db = require("./db.js");
var pool = db.getPool();

// constructor
const Accessory = function(accessory) {
    this.name = accessory.name;
    this.description = accessory.description;
    this.descriptionHtml = accessory.descriptionHtml,
    this.date = accessory.date;
    this.technique = accessory.technique;
    this.designer = accessory.designer;
    this.actors = accessory.actors;
    this.sex = accessory.sex;
    this.location = accessory.location;
    this.costume = accessory.costume;
    this.useName = accessory.useName;
    this.useCategory = accessory.useCategory;
    this.theatricalPlayName = accessory.theatricalPlayName;
    this.createdBy = accessory.createdBy;
    this.images = accessory.images;
};

Accessory.create = (newAccessory, result) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `INSERT INTO accessories SET name= ?, description= ?, 
      descriptionHtml=?, images=?,
      technique= ?, date= ?, sex= ?, 
      actors= ?, location= ?, designer= ?,
      useId= ( SELECT useID FROM uses WHERE name = ? AND use_category = ?), 
      costumeId = (SELECT costume_id FROM costumes WHERE costume_name = ?), 
      theatricalPlayId = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = ?), 
      createdBy = (select user_id from users where username = ?)`, 
      [ newAccessory.name, newAccessory.description, newAccessory.descriptionHtml, JSON.stringify(newAccessory.images),
        newAccessory.technique, newAccessory.date, newAccessory.sex, newAccessory.actors, newAccessory.location,
        newAccessory.designer, newAccessory.useName, newAccessory.useCategory, newAccessory.costume,
        newAccessory.theatricalPlayName, newAccessory.createdBy
      ],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
      console.log("created accessory: ", { id: res.insertId, ...newAccessory });
      result(null, { id: res.insertId, ...newAccessory });
      connection.release();
    });
  })
};

Accessory.findById = (accessoryId, result) => {
  pool.getConnection((err, connection) => {
    connection.query(`SELECT accessories.accessory_id, accessories.name, accessories.description, accessories.descriptionHtml,
    accessories.useId, accessories.sex, accessories.images, uses.name as use_name, uses.use_category,
    accessories.material, accessories.technique, accessories.date, accessories.location, theatrical_plays.title as tp_title, accessories.designer, accessories.theatricalPlayId, theatrical_plays.title as tp_title, accessories.parts, accessories.actors,  costumes.costume_name FROM accessories LEFT JOIN costumes ON accessories.costumeId = costumes.costume_id LEFT JOIN uses ON accessories.useId = uses.useID LEFT JOIN theatrical_plays ON accessories.theatricalPlayId=theatrical_plays.theatrical_play_id WHERE accessory_id= ?`, accessoryId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found accessory: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Item with the id
      result({ kind: "not_found" }, null);

      connection.release();
    });
  })
};
  
Accessory.getAll = (AuthUser, result) => {
  pool.getConnection((err, connection) => {
    connection.query("SELECT accessory_id, accessories.name, accessories.description, accessories.descriptionHtml, accessories.images, accessories.date, accessories.sex, accessories.material, accessories.technique, accessories.location, accessories.designer, accessories.parts, theatrical_plays.title as tp_title, accessories.actors, costumeId, accessories.useId, users.username as createdBy, uses.name as use_name, costumes.costume_name, uses.use_category FROM accessories JOIN (SELECT user_id FROM theaterdb.users where role <= '"+AuthUser+"') S2 ON accessories.createdBy = S2.user_id left join theatrical_plays ON accessories.theatricalPlayId = theatrical_play_id left join uses ON accessories.useId = uses.useID left join costumes ON accessories.costumeId=costumes.costume_id left join users on accessories.createdBy=users.user_id;", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      console.log("accessories: ", res);
      result(null, res);
      connection.release();
    });
  })
};
  
Accessory.updateById = (id, accessory, result) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `UPDATE accessories SET name= ?, description= ?, 
      descriptionHtml=?,
      date=? , technique= ?, sex= ?, 
      material= ?, actors= ?, location= ?, 
      designer= ?, parts= ?, images=?,
      useId= ( SELECT useID FROM uses WHERE name = ? AND use_category = ? ), 
      costumeId = (SELECT costume_id FROM costumes WHERE costume_name = ?), 
      theatricalPlayId = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = ?) 
      WHERE accessory_id=?`,
      [ accessory.name, accessory.description, accessory.descriptionHtml, accessory.date, accessory.technique,
        accessory.sex, accessory.material, accessory.actors, accessory.location, accessory.designer, accessory.parts,
        JSON.stringify(accessory.images), accessory.useName, accessory.useCategory, accessory.costume, accessory.theatricalPlayName,
        id
      ],
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
  
        console.log("updated accessory: ", { id: id, ...accessory });
        result(null, { id: id, ...accessory });
        connection.release();
      });
  })
};
  
Accessory.remove = (id, result) => {
  pool.getConnection((err, connection) => {
    connection.query('DELETE FROM accessories WHERE accessory_id = ?', id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Accessory with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted accessory with id: ", id);
      result(null, res);
      connection.release();
    });
  })
};
  
module.exports = Accessory;
