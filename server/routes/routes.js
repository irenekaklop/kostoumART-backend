module.exports = app => {
    const costumes = require("../controllers/costume.controller.js");
    const accessories = require("../controllers/accessory.controller.js");
    const uses = require('../controllers/use.controller.js');
    const theatricalPlays = require('../controllers/theatricalPlay.controller.js');

    // Costumes
    app.post("/costume", costumes.create);
  
    app.get("/costumes", costumes.findAll);
  
    app.get("/costumes/:costumeId", costumes.findOne);
  
    app.put("/costumes/:costumeId", costumes.update);
  
    app.delete("/costumes/:costumeId", costumes.delete);

    app.get("/costumes-filters", costumes.filter);

    app.post("/uploadImage", costumes.upload);

    app.get("/costumeImage", costumes.getFile);

    // Accessories
    app.post("/accessory", accessories.create);

    app.get("/accessories", accessories.findAll);

    app.get("/accessories/:accessoryId", accessories.findOne);

    app.put("/accessories/:accessoryId", accessories.update);

    app.delete("/accessories/:accessoryId", accessories.delete);

    // Uses
    app.post("/uses", uses.create);

    app.get("/uses", uses.findAll);
    
    app.get("/uses/:useId", uses.findOne);
    
    app.put("/uses/:useId", uses.update);
    
    app.delete("/uses/:useId", uses.delete);
    
    // Theatrical Plays
    app.post("/theatricalPlays", theatricalPlays.create);

    app.get("/theatricalPlays", theatricalPlays.findAll);
    
    app.get("/theatricalPlays/:theatricalPlayId", theatricalPlays.findOne);
    
    app.put("/theatricalPlays/:theatricalPlayId", theatricalPlays.update);
    
    app.delete("/theatricalPlays/:theatricalPlayId", theatricalPlays.delete);
};