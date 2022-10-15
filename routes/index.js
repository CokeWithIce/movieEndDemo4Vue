var express = require('express');
var router = express.Router();
var mongoose = require("../comm/db");
var recommend=require("../models/recommend");
var movie =require("../models/movie");
var article=require('../models/article');
var user =require("../models/user");





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mongooseTest',function(req,res,next){
  mongoose.Promise=global.Promise;
  var Cat=mongoose.model('Cat',{name:String});
  var tom=new Cat({name:'Tom'});
  tom.save(function(err){
    if(err){
    }else {
      console.log('success insert')
    }
  })
    res.send("数据库链接测试");
})


//上面是测试路由下面是正式前台开发api
// 显示主页推荐的大图
router.get('/showIndex',function(req,res,next){
  recommend.findAll(function(err,getRecommend){
    res.json({status:0,message:"获取成功",data:getRecommend})
  })
})
//显示所有的排行榜，也急死对于电影字段index的样式
router.get('/showRanking',function(req,res,next){
  movie.find({movieMainPage:true},function(err,getMovie){
    res.json({status:0,message:"获取主页",data:getMovie})
  })
})
//显示文章列表
router.get('/showArticle',function(req,res,next){
  article.findAll(function(err,getArticles){
    res.json({status:0,message:"获取主页",data:getArticles})
  })
})
//显示文章内容
router.post('/articleDetail', function (req, res, next) {
    if (!req.body.article_id) {
        res.json({status: 1, message: "文章id出错"})
    }
    article.findByArticleId(req.body.article_id, function (err, getAticle) {
        res.json({status:0,message:"获取成功",data:getAticle})
    })
})
//显示用户个人信息的内容
router.post('/showUser',function(req,res,next){
    if (!req.body.user_id) {
        res.json({status: 1, message: "用户状态出错"})
    }
    user.findById(req.body.user_id, function (err, getUser) {
        res.json({
            status: 0, message: "获取成功", data: {
                user_id: getUser._id,
                username: getUser.username,
                userMail: getUser.userMail,
                userPhone: getUser.userPhone,
                userStop: getUser.userStop
            }
        })
    })
})

module.exports = router;
