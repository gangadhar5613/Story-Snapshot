let express = require('express');
let router = express.Router();
let User = require('../models/User');
const Story = require('../models/story');
var multer = require('multer');
const auth = require('../middlewares/auth');
const Comment = require('../models/Comment');


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/upload');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({ storage : storage })






//list all stories from different users
router.get('/',auth.verifyLoggedInUser,(req, res, next) => {
   
    Story.find({}).populate('author').exec((err,stories) => {
        if(err) return next();
       
        res.render('allStories',{stories: stories});
        
    })
   
    
  });

router.get('/new',(req,res,next) => {
    res.render('addNewStory')
    
})

//create story
router.post('/new',upload.single('snapshot'),auth.verifyLoggedInUser,(req,res,next) => {
    req.body.snapshot = req.file.filename;
    req.body.author = req.user;
  Story.create(req.body,(err,story) => {
      
      console.log(story);
     console.log(req.user);
      if(err) return next();
      
      console.log(req.file)
      res.redirect('/dashboard');
      
      
  })
})

//edit story
router.get('/:id/edit',auth.verifyLoggedInUser,(req,res,next) => {
    const id = req.params.id;
    Story.findByIdAndUpdate(id,(err,story) => {
        if(err) return next();
        res.render('storyEdit',{story: story})
    })
})


//edit article
router.post('/:id/edit',(req,res,next) => {
    let id = req.params.id
    Story.findByIdAndRemove(id,req.body,{new:true},(err,updatedStory) => {
        if(err) return next();
        res.redirect('/userDashboard');

    })
})

//see story view
router.get('/:id',auth.verifyLoggedInUser,(req,res) => {
    let id = req.params.id
    req.body.author = req.user;
   console.log(req.user);
    Story.findById(id,(err,story) => {
        if(err) return next();
      Comment.find({articleId : id},(err,comments) => {
        res.render('storyView',{story : story,currentUser : req.user,comments : comments});
      })

       
    })
   
})

// router.get('/:id/edit',(req,res,next) => {
//     let id = req.params.id;
//     Story.findById(id,(err,story) => {
//         if(err) return next();
//         res.render('storyEdit',{story : story})
//     })
    
// })






router.get('/:id/delete',(req,res,next) => {
    let id = req.params.id;
    Story.findByIdAndDelete(id,(err,deletedArticle) => {
        if(err) return next();
        res.redirect('/dashboard')
    })
})



//comments

router.post('/:id/comments',auth.verifyLoggedInUser,(req,res,next) => {

    let id = req.params.id;

    req.body.articleId = id;
    let currentUser = req.user;
    req.body.authorId = currentUser;
    console.log('here is the id' + req.body.authorId);
  
      Comment.create(req.body,(err,comment) => {
        if(err) return next();       
          res.redirect(`/stories/`+ id);
          next();
        })   
  })


  
  module.exports = router;