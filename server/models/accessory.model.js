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
    this.userId = accessory.userId;
    this.images = accessory.images;
};

Accessory.create = (newAccessory, result) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `INSERT INTO accessories SET name= '${newAccessory.name}', description= '${newAccessory.description}', 
      descriptionHtml='${newAccessory.descriptionHtml}', images='${JSON.stringify(newAccessory.images)}',
      technique= '${newAccessory.technique}', date=  '${newAccessory.date}', sex= '${newAccessory.sex}', 
      actors= '${newAccessory.actors}', location= '${newAccessory.location}', designer= '${newAccessory.designer}',
      useId= ( SELECT useID FROM uses WHERE name = '${newAccessory.useName}' AND use_category = '${newAccessory.useCategory}'), 
      costumeId = (SELECT costume_id FROM costumes WHERE costume_name = '${newAccessory.costume}'), 
      theatricalPlayId = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '${ newAccessory.theatricalPlayName}'), 
      userId = ${newAccessory.userId}`, 
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
    accessories.material, accessories.technique, accessories.date, accessories.location, theatrical_plays.title as tp_title, accessories.designer, accessories.theatricalPlayId, theatrical_plays.title as tp_title, accessories.parts, accessories.actors,  costumes.costume_name FROM accessories LEFT JOIN costumes ON accessories.costumeId = costumes.costume_id LEFT JOIN uses ON accessories.useId = uses.useID LEFT JOIN theatrical_plays ON accessories.theatricalPlayId=theatrical_plays.theatrical_play_id WHERE accessory_id= ${accessoryId}`, (err, res) => {
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
    connection.query("SELECT accessory_id, accessories.name, accessories.description, accessories.descriptionHtml, accessories.images, accessories.date, accessories.sex, accessories.material, accessories.technique, accessories.location, accessories.designer, accessories.parts, theatrical_plays.title as tp_title, accessories.actors, costumeId, accessories.useId, accessories.userId, users.username as CreatedBy, uses.name as use_name, costumes.costume_name, uses.use_category FROM accessories JOIN (SELECT user_id FROM theaterdb.users where role <= '"+AuthUser+"') S2 ON accessories.userId = S2.user_id left join theatrical_plays ON accessories.theatricalPlayId = theatrical_play_id left join uses ON accessories.useId = uses.useID left join costumes ON accessories.costumeId=costumes.costume_id left join users on accessories.userId=users.user_id;", (err, res) => {
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
      `UPDATE accessories SET name= '${accessory.name}', description= '${accessory.description}', 
      descriptionHtml='${accessory.descriptionHtml}',
      date='${accessory.date}' , technique= '${accessory.technique}', sex= '${accessory.sex}', 
      material= '${accessory.material}', actors= '${accessory.actors}', location= '${accessory.location}', 
      designer= '${accessory.designer}', parts= '${accessory.parts}', images='${JSON.stringify(accessory.images)}',
      useId= ( SELECT useID FROM uses WHERE name = '${accessory.useName}' AND use_category = '${accessory.useCategory}' ), 
      costumeId = (SELECT costume_id FROM costumes WHERE costume_name = '${accessory.costume}'), 
      theatricalPlayId = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '${accessory.theatricalPlayName}') 
      WHERE accessory_id=${id}`,
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
