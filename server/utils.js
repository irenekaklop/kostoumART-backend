const fs = require('fs');

/*Save the base64 image in the server and returns the filename and path of image.*/
function saveImage(baseImage) {
    const localPath = `./uploads/images/`;
    //Find extension of file
    const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
    const fileType = baseImage.substring("data:".length,baseImage.indexOf("/"));
    //Forming regex to extract base64 data of file.
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = baseImage.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        const filename = `Photo_${Date.now()}_${rand}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`./uploads/`)) {
            fs.mkdirSync(`./uploads/`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        var path = localPath+filename;
        return path;
}

module.exports = {saveImage};