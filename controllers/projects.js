var Project = require('../models/project')
ObjectId = require("mongodb").ObjectID

var sendJSONresponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}
/*
*  GET /project route to retrieve all projects
*/
function getProjects (req, res) {
  Project.find({}, (err, projects) => {
    if (err) sendJSONresponse(res, 404, err)
    sendJSONresponse(res, 200, projects)
  })
}

/*
* GET /project/user 
*/

function getProjectsByUser (req, res) {
  var user = req.user
  Project.find({authorId: user._id}, (err, projects) => {
    if (err) sendJSONresponse(res, 404, err)
    sendJSONresponse(res, 200, projects)
  })
}

/*
*  POST /project route to save new project
*/
function postProject (req, res) {
  var user = req.user
  if (req.body.projectName) {
    var project = new Project({
      authorId: user._id,
      projectName: req.body.projectName
    })

    project.save((err, newProject) => {
      if (err) sendJSONresponse(res, 500, err)
      sendJSONresponse(res, 201, newProject)
    })
  } else {
    sendJSONresponse(res, 422, {
      message: 'Es necesario el nombre del projecto'
    })
  }
}

/*
*  PUT /project/main/:projectid to save main information
*/
function mainInformation (req, res) {
  var user = req.user
  var projectId = req.params.projectid

  console.log(user._id)

  if (projectId) {
    Project.findById(projectId, (err, project) => {
      console.log(project.authorId)
      if (err) sendJSONresponse(res, 500, err)
      let userId = new ObjectId(user._id)
      let authorId = new ObjectId(project.authorId)
      console.log(userId, authorId)
      if (userId.equals(authorId)) {
        Object.assign(project, req.body).save((err, project) => {
          if (err) sendJSONresponse(res, 500, err)
          sendJSONresponse(res, 200, project)
        })
      } else {
        sendJSONresponse(res, 404, {
          error: 'Unauthorized'
        })
      }
    })
  } else {
    sendJSONresponse(res, 422, {
      error: 'ProjectId is required'
    })
  }
}

/*
*  PUT /project/resume/:projectid
*/
function resumeProject (req, res) {
  var projectId = req.params.projectid

  if (projectId) {
    Project.findById(projectId, (err, project) => {
      if (err) sendJSONresponse(res, 500, err)
      Object.assign(project.resume, req.body).save((err, project) => {
        if (err) sendJSONresponse(res, 500, err)
        sendJSONresponse(res, 200, project)
      })
    })
  } else {
    sendJSONresponse(res, 422, {
      error: 'ProjectId is required'
    })
  }
}

/*
*  GET /project/:projectid route to retrieve a project given its id.
*/
function getProject (req, res) {
  if (req.params && req.params.projectid) {
    Project.findById(req.params.projectid, (err, project) => {
      if (!project) {
        sendJSONresponse(res, 404, {
          message: 'project not found'
        })
      } else if (err) {
        sendJSONresponse(res, 404, err)
      }
      sendJSONresponse(res, 200, project)
    })
  } else {
    sendJSONresponse(res, 422, {
      message: 'No projectid in request'
    })
  }
}

/*
*   DELETE /project/:projectid route to delete a project given its id
*/
function deleteProject (req, res) {
  var projectID = req.params.projectid
  if (projectID) {
    Project.remove({_id: projectID}, (err, result) => {
      if (err) sendJSONresponse(res, 500, err)
      sendJSONresponse(res, 204, result)
    })
  } else {
    sendJSONresponse(res, 422, {
      message: 'projectid is required'
    })
  }
}

module.exports = {
  getProjects,
  getProjectsByUser,
  postProject,
  mainInformation,
  resumeProject,
  getProject, 
  deleteProject
}
