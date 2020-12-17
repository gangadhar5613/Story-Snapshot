let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let storySchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    snapshot:{type:String,required:true},
    likes:{type:Number},
    comments:[{type:Schema.Types.ObjectId,ref:'Comment'}],
    tags:[{type:String}],
    author:{type:Schema.Types.ObjectId,required:true, ref:'User'}
},{timestamps:true})


let Story = mongoose.model('Story',storySchema);


module.exports = Story;

