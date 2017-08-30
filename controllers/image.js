const Proyect = require('../models/proyects');
const fs = require('fs');
const dirname = require('../../dirname');

var sendJSONresponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

/*
* POST /image/imagecard
*/
function imageCard(req, res){
    var proyectId = req.params.proyectid;
    var path = req.files.files.filePath;
    
    if(proyectId && path){
        Proyect.findById(proyectId, (err, proyect) => {
            if(err) {
                sendJSONresponse(res, 500, err);
                return;
            }
            if(proyect.principalInformation){
                fs.unlink(dirname+proyect.principalInformation)
            } else {
                proyect.principalInformation = path;
                proyect.save((err, proyect) => {
                    if(err) sendJSONresponse(res, 500, err);
                    sendJSONresponse(res, 200, proyect);
                })
            }
        })
    } else {
        sendJSONresponse(res, 422, {
            error : "proyectid and file are required"
        });
    }
};