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
router.get('/',(req, res, next) => {
   
    Story.find({}).populate('author').exec((err,stories) => {
        if(err) return next();
       console.log('From stories page'+ req.session.userID);
       let uderId = req.session.userID;
       let loginOption;
       if(req.session.userID == undefined ){
            loginOption = 'login'
       }
       else{
         loginOption = 'dashboard';
       }
       console.log(loginOption)
        res.render('allStories',{stories: stories,loginOption : loginOption });
        
    })
   
    
  });

router.get('/new',auth.verifyLoggedInUser,(req,res,next) => {
    res.render('addNewStory')
    
})

//create story
router.post('/new',upload.single('snapshot'),auth.verifyLoggedInUser,(req,res,next) => {
    req.body.snapshot = req.file.filename;
    req.body.author = req.user;
    req.body.tags = req.body.tags.split(' ');
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
    Story.findById(id,(err,story) => {
        if(err) return next();
        res.render('storyEdit',{story: story})
        console.log('from edit page')
        
    })
})


//edit article
router.post('/:id/edit',auth.verifyLoggedInUser,(req,res,next) => {
    let id = req.params.id
   
   Story.findByIdAndUpdate(id,req.body,{new:true}, (err,updated) => {
       if(err) return next();
       res.redirect('/dashboard');
   })
})

//see story view
router.get('/:id',(req,res,next) => {
    let id = req.params.id
    // req.body.author = req.user;
    req.body.author = req.session.userID;


   console.log('from comment' + req.session.userID);
   
   Story.findById(id).populate('author').exec((err,story) => {
       if(err) return next();

       Comment.find({articleId : id}).populate('authorId').exec((err,comments) => {
            if(err) return next();
            let tags =  story.tags[0] ;
            story.tags =  tags.split(' ')  
            console.log(comments);
            Story.find({author: req.body.author},(err,stories) => {
                if(err) return next();
                res.render('storyView',{story : story ,comments : comments,stories : stories});
            })
       })
   })

})








router.get('/:id/delete',auth.verifyLoggedInUser,(req,res,next) => {
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
    
    if(req.body.authorId == null){
        res.redirect('/user/login')
    }else{
        Comment.create(req.body,(err,comment) => {
            Story.findByIdAndUpdate(id,{$push : {comments : comment._id }},(err,story) => {
              if(err) return next();       
              res.redirect(`/stories/`+ id);
              next();
            }) 
            })
          
    }
    
  })


  
  module.exports = router;