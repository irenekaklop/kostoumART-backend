const Costume = require("../models/costume.model.js");
const {saveImage, removeImage} = require("../utils/utils.js");

// Create and Save a new Costume
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  //Prepare arrays
  let _sexsStr = '';
  let _materialsStr = '';
  for (let i=0; i < req.body.data.selectedSexOption.value.length; i++){
    _sexsStr = _sexsStr + req.body.data.selectedSexOption.value[i].value;
    if(i !== req.body.data.selectedSexOption.value.length-1){
      _sexsStr = _sexsStr + ", ";
    }
  }
  for (let i=0; i < req.body.data.selectedMaterialOption.value.length; i++){
    _materialsStr = _materialsStr + req.body.data.selectedMaterialOption.value[i].value;
    if(i !== req.body.data.selectedMaterialOption.value.length-1){
      _materialsStr=_materialsStr+', ';
    }
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

  const costume = new Costume({
    costume_name: req.body.data.name.value,
    description: req.body.data.description.value,
    descriptionHtml: req.body.data.descriptionHtml.value,
    useName: req.body.data.selectedUseOption.value,
    useCategory: req.body.data.selectedUseOption.category, 
    technique: req.body.data.selectedTechniqueOption.value,
    sex: _sexsStr,
    material: _materialsStr,
    date:  req.body.data.selectedDateOption.value,
    actors: req.body.data.actors.value,
    location: req.body.data.location.value,
    designer: req.body.data.designer.value,
    theatricalPlayName: (req.body.data.selectedTPOption.valid ? req.body.data.selectedTPOption.value : null ),
    parts: req.body.data.parts.value,
    images: imagesObj,
    createdBy: req.body.createdBy
  });
  
  // Save Item in the database
  Costume.create(costume, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Costume."
      });
    else res.send(data);
  });
};

// Retrieve all Costumes from the database.
exports.findAll = (req, res) => {  
  let AuthUser = req.query.userType;
  Costume.getAll( AuthUser, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving costumes."
        });
    else res.send(data);
  });
};

// Find a single Costume with a costumeId
exports.findOne = (req, res) => {
    Costume.findById( req.params.costumeId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Costume with id ${req.params.costumeId}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Costume with id " + req.params.costumeId
            });
          }
        } else res.send(data);
      });
};

// Update a Costume identified by the costumeId in the request
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
  let _materialsStr = '';
  for (let i=0; i < req.body.data.selectedSexOption.value.length; i++){
    _sexsStr = _sexsStr + req.body.data.selectedSexOption.value[i].value;
    if(i !== req.body.data.selectedSexOption.value.length-1){
      _sexsStr = _sexsStr + ", ";
    }
  }
  for (let i=0; i < req.body.data.selectedMaterialOption.value.length; i++){
    _materialsStr = _materialsStr + req.body.data.selectedMaterialOption.value[i].value;
    if(i !== req.body.data.selectedMaterialOption.value.length-1){
      _materialsStr=_materialsStr+', ';
    }
  }
 
  const costume = new Costume({
    costume_name: req.body.data.name.value,
    description: req.body.data.description.value,
    descriptionHtml: req.body.data.descriptionHtml.value,
    useName: req.body.data.selectedUseOption.value,
    useCategory: req.body.data.selectedUseOption.category, 
    technique: req.body.data.selectedTechniqueOption.value,
    sex: _sexsStr,
    material: _materialsStr,
    date:  req.body.data.selectedDateOption.value,
    actors: req.body.data.actors.value,
    location: req.body.data.location.value,
    designer: req.body.data.designer.value,
    theatricalPlayName: (req.body.data.selectedTPOption.valid ? req.body.data.selectedTPOption.value : null ),
    parts: req.body.data.parts.value,
    images: imagesObj,
    createdBy: req.body.createdBy
  });


  Costume.updateById( req.params.costumeId, costume, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
        message: `Not found Costume with id ${req.params.costumeId}.`
        });
      } else {
        res.status(500).send({
        message: "Error updating Costume with id " + req.params.costumeId
        });
      }
    } else res.send(data);
  });
};

// Delete a Costume with the specified costumeId in the request
exports.delete = (req, res) => {
    Costume.remove(req.params.costumeId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Costume with id ${req.params.costumeId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Costume with id " + req.params.costumeId
            });
          }
        } else res.send({ message: `Costume was deleted successfully!` });
      });
};

exports.getFile = (req, res) => {
  res.sendFile(req.body.path, { root: __dirname });
}
