const express = require("express");
const projectsDb = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
    projectsDb.get()
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "There was an error retrieving this", err})
        })
})

router.get("/:id", validateId, (req, res) => {
    const {id} = req.params;

    projectsDb.get(id)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "cannot find this project id"})
        })
})

router.get("/:id/actions", validateId, (req, res) => {
    const {id} = req.params;

    projectsDb.getProjectActions(id)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "cannot find actions with this project id"})
        })
})

router.post("/", validateProject, (req, res) => {
    projectsDb.insert(req.body)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            res.status(500).json({error: "Error while saving this to database", err})
        })
})

router.put("/:id", validateId, validateProject, (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    projectsDb.update(id, changes)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "Error while saving the update", err})
        })
})

router.delete("/:id", validateId, (req, res) => {
    const {id} = req.params;

    projectsDb.remove(id)
        .then(project => {
            console.log(project)
            res.status(202).end()
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "Cannot delete this project"})
        })
})

//Middleware
function validateId(req, res, next) {
    // do your magic!
    const {id} = req.params;
  
    projectsDb.get(id)
      .then(user => {
          if(user) {
            req.user = user;
            next();
          } else {
            res.status(400).json({ message: "Invalid id" })
          }
      })
      .catch(err => {
        res.status(500).json({message: "error getting actions with this id", err})
      })
  }

function validateProject(req, res, next){

    if (!req.body.name || !req.body.description) {
        res.status(400).json({ message: 'Please add project name and description' })
    } else {
        next()
    }
}
module.exports = router;