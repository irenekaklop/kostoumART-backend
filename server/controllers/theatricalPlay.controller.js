const TheatricalPlay = require('../models/theatricalPlay.model.js');

// Create and Save a new Item
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    let _yearsStr = '';
    for (let i=0; i < req.body.data.years.value.length; i++){
        _yearsStr = _yearsStr + req.body.data.years.value[i].value;
        if(i !== req.body.data.years.value.length-1){
            _yearsStr = _yearsStr + ", ";   
        }
    }

    const theatricalPlay = new TheatricalPlay({
        title: req.body.data.name.value, 
        years: _yearsStr, 
        actors: req.body.data.actors.value, 
        director: req.body.data.director.value, 
        theater: req.body.data.theater.value, 
        userId: req.body.userId 
    })
    
    // Save Item in the database
    TheatricalPlay.create(theatricalPlay, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the theatrical play."
            });
        else res.send(data);        
    });
};
  
// Retrieve all Items from the database.
exports.findAll = (req, res) => {
    let AuthUser = req.query.user;
    console.log("AuthUser", AuthUser);
    TheatricalPlay.getAll( AuthUser, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving theatrical plays."
            });
        else res.send(data);
    });
};
    
// Find a single Item with a Id
exports.findOne = (req, res) => {
    TheatricalPlay.findById( req.params.theatricalPlayId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found theatrical play with id ${req.params.theatricalPlayId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving theatrical play with id " + req.params.theatricalPlayId
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

    let _yearsStr = '';
    for (let i=0; i < req.body.data.years.value.length; i++){
      _yearsStr = _yearsStr + req.body.data.years.value[i].value;
      if(i !== req.body.data.years.value.length-1){
        _yearsStr = _yearsStr + ", ";
      }
    }
    
    const theatricalPlay = new TheatricalPlay({
        title: req.body.data.name.value, 
        years: _yearsStr, 
        actors: req.body.data.actors.value, 
        director: req.body.data.director.value, 
        theater: req.body.data.theater.value, 
        userId: req.body.userId 
    })

    TheatricalPlay.updateById( req.params.theatricalPlayId, theatricalPlay, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found theatrical play with id ${req.params.theatricalPlayId}.`
                });
            } 
            else {
                res.status(500).send({
                    message: "Error updating theatrical play with id " + req.params.theatricalPlayId
                });
            }
        } 
        else res.send(data);
    });
  };
  
// Delete a Item with the specified Id in the request
exports.delete = (req, res) => {
    TheatricalPlay.remove(req.params.theatricalPlayId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found theatrical play with id ${req.params.theatricalPlayId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete theatrical play with id " + req.params.theatricalPlayId
                });
            }
          } 
        else res.send({ message: `Theatrical play was deleted successfully!` });
    });
};
  
  