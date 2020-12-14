let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
const { use } = require('../routes');


let userSchema = new Schema({
    username:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true}
},{timestamps:true})


userSchema.pre('save',function(next){
    if(this.password){
        bcrypt.hash(this.password,12,(err,hash) => {
            if(err) return next();
            this.password = hash;
            next();
        })
    }else{
        next();
    }
});



userSchema.verifyPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}



let User = mongoose.model('User',userSchema);

module.exports = User;