let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
    comment:{type:String,required:true},
    authorId:{type:Schema.Types.ObjectId,required:true,ref:'User'},
    articleId:{type:Schema.Types.ObjectId,required:true,ref:"Article"}
    
},{timestamps:true})


let Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;