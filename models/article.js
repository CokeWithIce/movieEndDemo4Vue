var mongoose =require("../comm/db")
var article=new mongoose.Schema({
    articleTitle:String,
    articleContext:String,
    articleTime:String
})
article.statics.findByArticleId=function(id,callBack){
    this.find({_id:id},callBack)
}
var articleModel=mongoose.model("article",article)
module.exports=articleModel;