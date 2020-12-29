const Accessory = require("../models/accessory.model.js");
const {saveImage, removeImage} = require("../utils/utils.js");

// Create and Save a new Item
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  //To upload images
  let images = req.body.data.images.value;
  let imagesObj = [];
  if(images.length>0){
    images.map(image => {
      if(!image.isUploaded){
        const uploadResult = saveImage(image.base64);
        imagesObj = imagesObj.concat([{
            path: uploadResult.path
          }])
      }
      else{
        imagesObj = imagesObj.concat([{ path: image.path}])
      }
    })
  }

  //Prepare arrays
  let _sexsStr = '';
  for (let i=0; i < req.body.data.selectedSexOption.value.length; i++){
    _sexsStr = _sexsStr + req.body.data.selectedSexOption.value[i].value;
    if(i !== req.body.data.selectedSexOption.value.length-1){
      _sexsStr = _sexsStr + ", ";
    }
  }
  
  const accessory = new Accessory({
    name: req.body.data.name.value,
    description: req.body.data.description.value,
    descriptionHtml: req.body.data.descriptionHtml.value,
    useName: req.body.data.selectedUseOption.value,
    useCategory: req.body.data.selectedUseOption.category, 
    technique: req.body.data.selectedTechniqueOption.value,
    sex: _sexsStr,
    costume: req.body.data.selectedCostumeOption.value,
    date:  req.body.data.selectedDateOption.value,
    actors: req.body.data.actors.value,
    location: req.body.data.location.value,
    designer: req.body.data.designer.value,
    theatricalPlayName: (req.body.data.selectedTPOption.valid ? req.body.data.selectedTPOption.value : null ),
    createdBy: req.body.createdBy,
    images: imagesObj
  });

  // Save Item in the database
  Accessory.create(accessory, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Accessory."
      });
    else res.send(data);
  });
};

// Retrieve all Items from the database.
exports.findAll = (req, res) => {
    let AuthUser = req.query.userType;
    Accessory.getAll( AuthUser, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving accessories."
          });
        else res.send(data);
    });
};

// Find a single Item with a Id
exports.findOne = (req, res) => {
    Accessory.findById( req.params.accessoryId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Accessory with id ${req.params.accessoryId}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Accessory with id " + req.params.accessoryId
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
        });
    }
    //To upload images
    let images = req.body.data.images.value;
    let imagesObj = [];
    if(images.length>0){
      images.map(image => {
        if(!image.isUploaded){
          const uploadResult = saveImage(image.base64);
          imagesObj = imagesObj.concat([{
              path: uploadResult.path
            }])
        }
        else{
          imagesObj = imagesObj.concat([{ path: image.path}])
        }
      })
    }

    //Remove images if needed
    let removed = req.body.data.removedImages.value;
    if(removed.length>0){
      removed.map(image => {
        removeImage(image.path);
      })
    }

    //Prepare arrays
    let _sexsStr = '';
    for (let i=0; i < req.body.data.selectedSexOption.value.length; i++){
     _sexsStr = _sexsStr + req.body.data.selectedSexOption.value[i].value;
     if(i !== req.body.data.selectedSexOption.value.length-1){
       _sexsStr = _sexsStr + ", ";
     }
    }
 
    const accessory = new Accessory({
        name: req.body.data.name.value,
        description: req.body.data.description.value,
        descriptionHtml: req.body.data.descriptionHtml.value,
        useName: req.body.data.selectedUseOption.value,
        useCategory: req.body.data.selectedUseOption.category, 
        technique: req.body.data.selectedTechniqueOption.value,
        sex: _sexsStr,
        costume: req.body.data.selectedCostumeOption.value,
        date:  req.body.data.selectedDateOption.value,
        actors: req.body.data.actors.value,
        location: req.body.data.location.value,
        designer: req.body.data.designer.value,
        theatricalPlayName: (req.body.data.selectedTPOption.valid ? req.body.data.selectedTPOption.value : null ),
        images: imagesObj,
        createdBy: req.body.createdBy
    });

    Accessory.updateById( req.params.accessoryId, accessory, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Not found Accessory with id ${req.params.accessoryId}.`
                });
            } 
            else {
                res.status(500).send({
                message: "Error updating Accessory with id " + req.params.accessoryId
            });}
        } 
        else res.send(data);
    });
};

// Delete a Accessory with the specified accessoryId in the request
exports.delete = (req, res) => {
    Accessory.remove(req.params.accessoryId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Accessory with id ${req.params.accessoryId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Accessory with id " + req.params.accessoryId
            });
          }
        } else res.send({ message: `Accessory was deleted successfully!` });
      });
};

