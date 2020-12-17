let express = require('express');
let router = express.Router();
let User = require('../models/User');
const Story = require('../models/story');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'upload');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({ storage : storage })


router.get('/', function(req, res, next) {
    res.render('storiesList');
  });

router.get('/new',(req,res,next) => {
    res.render('addNewStory')
    console.log(req.file)
})

//create story
router.post('/new',upload.single('snapshot'),(req,res,next) => {
  Story.create(req.body,(err,story) => {
      if(err) return next();
      console.log(req.file)
      res.redirect('/dashboard')
      
  })
})

//edit story
router.get('/:id/edit',(req,res,next) => {
    const id = req.params.id;
    Story.findById(id,(err,story) => {
        if(err) return next();
        res.render('editStory')
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