var mongoose = require("../comm/db");
var Movie=new mongoose.Schema({
    movieName:String,
    movieImg:String,
    movieVideo:String,
    movieDownload:String,
    movieTime:String,
    movieNumSuppose:Number,
    movieNumDownload:Number,
    movieMainPage:Boolean,
})

Movie.statics.findById=function(){
    this.find({movie_id:m_id,check:true},callBack);
}
var movieModel=mongoose.model('movie',Movie);
module.exports=movieModel;
