var mongoose = require("../comm/db");
var user=new mongoose.Schema({
    username:String,
    password:String,
    userMail:String,
    userPhone:String,
    userAdmin:Boolean,
    userPower:Number,
    userStop:Boolean,
})
user.statics.findAll=function(callback){
    this.find({},callback());
}
user.statics.findByUsername=function(name,callback){
    this.find({username:name},callback);
}
user.statics.findUserLogin=function(name,password,callback){
    this.find({username:name,password:password,userStop:false},callback);
}
user.statics.findUserPassword=function(name,mail,phone,callback){
    this.find({username:name,userMail:mail,userPhone:phone},callback);
}
user.statics.addUser=function(obj){
    this.save({
        username:obj.username,
        password:obj.password,
        userMail:obj.userMail||"",
        userPhone:obj.userPhone||"",
        userPower:obj.userPower||1,
        userAdmin:obj.userAdmin||true,
        userStop:obj.userStop||true,
    })
}
var userModel=mongoose.model('user',user);
module.exports=userModel;