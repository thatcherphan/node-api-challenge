const express = require("express");
const actionDb = require("../data/helpers/actionModel");

const router = express.Router();

router.get("/:id", validateId, (req, res) => {
    const id = req.params.id;

    actionDb.get(id)
        .then(action => {
            if(!id) {
                res.status(404).json({message: "Please insert a valid ID"})
            } else {
                res.status(200).json(action)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "This information cannot be found"})
        })
})

router.post("/:id", validateId, validateAction, (req, res) => {
    const id = req.params.id;

    actionDb.insert(req.body)
        .then(action => {
            if(!id) {
                res.status(404).json({message: "Please use a valid ID"})
            } else if(req.body.description === ""){
                res.status(400).json({message: "Please add a description"})
            } else {
                res.status(200).json(action)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({Error: "error while saving this action", err})
        })
})

router.put("/:id", validateId, validateAction, (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    actionDb.update(id, changes)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            res.status(500).json({message: "Cannot be update", err})
        })

})

router.delete("/:id", validateId, (req, res) => {
    const {id} = req.params;

    actionDb.remove(id)
        .then(action => {
            console.log(action)
            res.status(200).end()
        })
        .catch(err => {
            res.status(500).json({error: "cannot delete this action", err})
        })
})


//Middleware
function validateId(req, res, next) {
    // do your magic!
    const {id} = req.params;
  
    actionDb.get(id)
      .then(user => {
          if(user) {
            req.user = user;
            next();
          } else {
            res.status(400).json({ message: "Invalid id" })
          }
      })
      .catch(err => {
        res.status(500).json({message: "error getting information with this id", err})
      })
  }

function validateAction(req, res, next){
    const {description} = req.body;

    if (!req.body.project_id || !req.body.description) {
        res.status(400).json({ message: 'Please add valid project id and description' })
    } else if (description.length > 128) {
        res.status(400).json({message: "This description is longer than 128 characters."})
    } else {
        next()
    }
}

  module.exports = router;