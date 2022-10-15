var mongoose=require("../comm/db")
var recommend=new mongoose.Schema({
    recommendImg:String,
    recommendSrc:String,
    recommendTitle:String
})
recommend.statics.findByIndexId=function(m_id,callBack){
    this.find({findByIndex:m_id},callBack);
}
recommend.statics.findAll=function(callBack){
    this.find({},callBack);
}
var recommendModels=mongoose.model("recommend",recommend);
module.exports=recommendModels;