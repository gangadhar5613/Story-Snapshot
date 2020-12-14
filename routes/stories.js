let express = require('express');
let router = express.Router();
let User = require('../models/User');
const Story = require('../models/story');


router.get('/', function(req, res, next) {
    res.render('storiesList');
  });



//create story
router.post('/new',(req,res,next) => {
  Story.create(req.body,(err,story) => {
      if(err) return next();
      res.redirect('/dashboard')
  })
})

//edit story
router.get('/:id/edit',(req,res,next) => {
    const id = req.params.id;
    Story.findById(id,(err,story) => {
        if(err) return next();
        res.render('editStory',{story})
    })
})


router.post('/:id/edit',(req,res,next) => {
    let id = req.params.id
    Story.findByIdAndRemove(id,req.body,{new:true},(err,updatedStory) => {
        if(err) return next();
        res.redirect('/userDashboard')
    })
})

  
  module.exports = router;