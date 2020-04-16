const Use = require('../models/use.model.js')

// Create and Save a new Item
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    
    const use = new Use({
        name: req.body.data.name.value, 
        use_category: req.body.data.useCategory.value, 
        descriptionHtml: req.body.data.descriptionHtml.value,
        description: req.body.data.description.value, 
        customs: req.body.data.customs.value, 
        userId: req.body.userId
    });
    
    // Save Item in the database
    Use.create(use, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Use."
            });
        else res.send(data);        
    });
};
  
// Retrieve all Items from the database.
exports.findAll = (req, res) => {
    let AuthUser = req.query.user;
    console.log("AuthUser", AuthUser);
    Use.getAll( AuthUser, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving uses."
            });
        else res.send(data);
    });
};
    
// Find a single Item with a Id
exports.findOne = (req, res) => {
    Use.findById( req.params.useId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Use with id ${req.params.useId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Use with id " + req.params.useId
                });
                }
        } else res.send(data);
    });
};
  
// Update a item identified by the Id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
    });}
   
    const use = new Use({
        name: req.body.data.name.value, 
        use_category: req.body.data.useCategory.value, 
        description: req.body.data.description.value, 
        descriptionHtml: req.body.data.descriptionHtml.value,
        customs: req.body.data.customs.value, 
        userId: req.body.userId
    });

    console.log(req.body, use);
    Use.updateById( req.params.useId, use, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Use with id ${req.params.useId}.`
                });
            } 
            else {
                res.status(500).send({
                    message: "Error updating USE with id " + req.params.useId
                });
            }
        } 
        else res.send(data);
    });
  };
  
// Delete a Item with the specified Id in the request
exports.delete = (req, res) => {
    console.log(req.params)
    Use.remove(req.params.useId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Use with id ${req.params.useId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Accessory with id " + req.params.useId
                });
            }
          } 
        else res.send({ message: `Use was deleted successfully!` });
    });
};
  
  