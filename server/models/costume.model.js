const sql = require("./db.js");

// constructor
const Costume = function(costume) {
    this.costume_name = costume.costume_name;
    this.description = costume.description;
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
    this.userId = costume.userId;
    this.images = costume.images;
};

Costume.create = (costume, result) => {
  console.log("costum insert", costume)
    sql.query(
      `INSERT INTO costumes SET costume_name= '${costume.costume_name}', description= '${costume.description}', 
      technique= '${costume.technique}', date=  '${costume.date}', sex= '${costume.sex}', material= '${costume.material}', 
      actors= '${costume.actors}', location= '${costume.location}', designer= '${costume.designer}', 
      parts= '${costume.parts}',
      useID= ( SELECT useID FROM uses WHERE name = '${costume.useName}' AND use_category = '${costume.useCategory}'), 
      theatrical_play_id = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '${costume.theatricalPlayName}'), userId = ${costume.userId}`, 
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
  
      console.log("created costume: ", { id: res.insertId, ...costume });
      result(null, { id: res.insertId, ...costume });
    });
};
  
Costume.findById = (costumeId, result) => {
    sql.query(`SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.useID, costumes.sex, uses.name as use_name, uses.use_category, costumes.material, costumes.technique,costumes.date, costumes.location, costumes.location_influence, costumes.designer, costumes.theatrical_play_id, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes LEFT JOIN uses ON costumes.useID = uses.useID LEFT JOIN theatrical_plays ON costumes.theatrical_play_id=theatrical_plays.theatrical_play_id WHERE costume_id= ${costumeId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found costume: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Cosutme with the id
      result({ kind: "not_found" }, null);
    });
};
  
Costume.getAll = (AuthUser, result) => {
    sql.query("SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.date, costumes.useID, costumes.sex, uses.name as use_name, uses.use_category, costumes.userId as costumeCreator, users.username as createdBy, costumes.material, costumes.technique, costumes.location, costumes.location_influence, costumes.designer, costumes.theatrical_play_id, theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes JOIN (SELECT user_id FROM users where role <= '"+AuthUser+"') S2 ON costumes.userId = S2.user_id left join users on costumes.userId=users.user_id left join theatrical_plays on costumes.theatrical_play_id=theatrical_plays.theatrical_play_id left join uses ON costumes.useID = uses.useID", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("costumes: ", res);
      result(null, res);
    });
};
  
Costume.updateById = (id, costume, result) => {
  console.log(costume);
  sql.query(
    `UPDATE costumes SET costume_name= '${costume.costume_name}', description= '${costume.description}', 
    date= '${costume.date}' , technique= '${costume.technique}', sex= '${costume.sex}', 
    material= '${costume.material}', actors= '${costume.actors}', location= '${costume.location}', 
    designer= '${costume.designer}', 
    useID= ( SELECT useID FROM uses WHERE name = '${costume.useName}' AND use_category = '${costume.useCategory}'), 
    theatrical_play_id = ( SELECT theatrical_play_id FROM theatrical_plays WHERE title = '${costume.theatricalPlayName}') 
    WHERE costume_id=${id}`,
      (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
  
        if (res.affectedRows == 0) {
          // not found Costume with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated costume: ", { id: id, ...costume });
        result(null, { id: id, ...costume });
      }
    );
};
  
Costume.remove = (id, result) => {
    sql.query("DELETE FROM costumes WHERE costume_id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
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
    });
};

Costume.filter = (sex, technique, result) => {
  console.log(sex, technique)
  let query = `SELECT costumes.costume_id, costumes.costume_name, costumes.description, costumes.date, costumes.useID, costumes.sex, 
  uses.name as use_name, costumes.userId as costumeCreator, costumes.material, costumes.technique, 
  costumes.location, costumes.location_influence, costumes.designer, costumes.theatrical_play_id, 
  theatrical_plays.title as tp_title, costumes.parts, costumes.actors FROM costumes 
  JOIN (SELECT user_id FROM users where role <= 1) S2 ON costumes.userId = S2.user_id 
  left join theatrical_plays on costumes.theatrical_play_id=theatrical_plays.theatrical_play_id 
  left join uses ON costumes.useID = uses.useID`
  if(technique || sex){
    query = query + " WHERE ("
  }
  if(technique){
    for(var i=0; i<technique.length; i++){
      if(i>0){
        query= query + " || "
      }
      query = query +"technique='"+ technique[i] + "'";
    }
    query = query + ')'
  }
  if(technique&&sex){
    query = query + ' && (';
  }
  if(sex){
    for(var i=0; i<sex.length; i++){
      if(i>0){
        query = query + " || "
      }
      query = query +"sex LIKE'%"+ sex[i] + "%'";
    }
    query=query+')'
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Costume with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Filter succeed");
    result(null, res);
  })
  console.log("FILTERS", query);
}
  
module.exports = Costume;