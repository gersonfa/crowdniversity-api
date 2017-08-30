const Proyect = require('../models/proyects')

var sendJSONresponse = function(res, status, content){
  res.status(status)
  res.json(content)
}

/*
*  POST /proyect/recompense/:proyectid
*/
function postRecompense (req, res){
  var user = req.user
  var proyectId = req.params.proyectid

  if(proyectId){
    Proyect.findById(proyectId, (err, proyect) => {
      if (err) {
        sendJSONresponse(res, 500, err)
        return
      }
      if (proyect.authorId === user._id){
        let recompense = {};
        Object.assign(recompense, req.body)

        proyect.recompenses.push(recompense)
        proyect.save((err, proyect) => {
          if(err) sendJSONresponse(res, 500, err)
          sendJSONresponse(res, 201, proyect)
        })
      } else {
        sendJSONresponse(res, 401, {
          error: "Unauthorized"
        })
      }
    })
  } else {
    sendJSONresponse(res, 422, {
        error: "proyectid is required"
    })
  }
}


/*
*  DELETE /proyect/recompense/:proyectid/:recompenseid
*/
function deleteRecompense(req, res){
  var user = req.user
  var proyectId = req.params.proyectid
  var recompenseId = req.params.recompenseid

  if (proyectId){
    Proyect.findById(proyectId)
      .select('recompenses')
      .exec((err, proyect) => {
        if (err) {
          sendJSONresponse(res, 500, err)
          return
        }
        proyect.recompenses.id(recompenseId).remove()
          proyect.save((err, proyect) => {
            if (err) {
              sendJSONresponse(res, 500, err)
              return
            }
            sendJSONresponse(res, 204, proyect)
          })
      })
  } else {
    sendJSONresponse(res, 422, {
      error: "proyectid and recompenseid are required"
    })
  }
}

module.exports = {
  postRecompense,
  deleteRecompense
}
