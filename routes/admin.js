var express=require("express");
var router=express.Router();
var movie=require("../models/movie");
var user=require("../models/user");
var comment=require("../models/comment");
var article=require("../models/article");
var recommend=require("../models/recommend");

router.post('/', function(req, res, next) {
    res.send('respond with a resource');
});


//新增电影的接口
router.post("/movieAdd",function(req,res,next){
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.movieName){
        res.json({status:1,message:"电影名为空"})
    }
    if(!req.body.movieImg){
        res.json({status:1,message:"电影图片为空"})
    }
    if(!req.body.movieDownload){
        res.json({status:1,message:"电影下载地址为空"})
    }
    if(!req.body.movieMainPage){
        var movieMainPage=false;
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id)
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                var saveMovie=new movie({
                    movieName:req.body.movieName,
                    movieImg:req.body.movieImg,
                    movieVideo:req.body.movieVideo,
                    movieDownload:req.body.movieDownload,
                    movieTime:req.body.movieTime,
                    movieVumSuppose:0,
                    movieNumDownload:0,
                    movieMainPage:movieMainPage
                })
                saveMovie.save(function(err){
                    if(err){
                        res.json({status:1,message:err})
                    }else{
                        res.sjon({status:0,message:"添加成功"})
                    }
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用了"})
            }

        })
    }else{
        res.json({status:1,message:check.message})
    }
})

//删除电影的接口
router.post("/movieDel",function(req,res,next){
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"电影id传递失败"})
    }
    if(!req.body.movieId){
        res.json({status:1,message:"用户传递错误"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByusername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                movie.remove({_id:req.body.movieId},function(err,delMovie){
                    res.json({status:0,message:"删除成功",data:delMovie})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用了"})
            }
        })
    }else{
        res.json({status:1,message:check.message});
    }
})
//删除电影的接口
router.post("/movieUpdate",function(req,res,next){
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"电影id传递失败"})
    }
    if(!req.body.movieId){
        res.json({status:1,message:"用户传递错误"})
    }
    var saveData=req.body.movieInfo;
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByusername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                movie.update({_id:req.body.movieId},saveData,function(err,delMovie){
                    res.json({status:0,message:"删除成功",data:delMovie})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用了"})
            }
        })
    }else{
        res.json({status:1,message:check.message});
    }
})

//显示后台的所有电影
router.get("/movie",function(req,res,next){
    movie.findAll(function(err,allMovie){
        res.json({status:0,message:"获取成功",data:allMovie});
    })
})

//显示后台所有评论
router.get("/commentList",function(req,res,next){
    comment.findAll(function(err,allComment){
        res.json({status:0,message:"success find",data:allComment})
    })
})
//将评论审核
router.post("/checkComment",function(req,res,next){
    if(!req.body.commentId){
        res.json({status:1,message:"评论id传递失败"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"电影id传递失败"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户传递错误"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                comment.update({_id:req.body.commentId},{check:true},function(err,updateComment){
                    res.json({status:0,message:"comment success",data:updateComment})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//删除用户评论
router.post("/delComment",function(req,res,next){
    if(!req.body.commentId){
        res.json({status:1,message:"评论id传递失败"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"电影id传递失败"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户传递错误"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                comment.remove({_id:req.body.commentId},function(err,updateComment){
                    res.json({status:0,message:"delete comment success",data:updateComment})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//封停用户
router.post("/stopUser",function(req,res,next){
    if(!req.body.userId){
        res.json({status:1,message:"用户id传递失败"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                user.update({_id:req.body.userId},{userStop:true},function(err,updateComment){
                    res.json({status:0,message:"delete comment success",data:updateComment})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//更新用户密码
router.post("/changeUser",function(req,res,next){
    if(!req.body.userId){
        res.json({status:1,message:"用户id传递失败"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    if(!req.body.newPassword){
        res.json({status:1,message:"用户新密码错误"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                user.update({_id:req.body.userId},{password:req.body.newPassword},function(err,updateComment){
                    res.json({status:0,message:"update newPassword success",data:updateComment})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//显示所用用户
router.post("/showUser",function(req,res,next){
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                user.findAll(function(err,allUser){
                    res.json({status:0,message:"find all users success",data:allUser})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//管理用户权限
router.post("/powerUpdate",function(req,res,next){
    if(!req.body.userId){
        res.json({status:1,message:"用户id传递失败"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                user.update({_id:req.body.userId},{userAdmin:true},function(err,updateUser){
                    res.json({status:0,message:"update userAdmin success",data:updateUser})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//新增文章
router.post("/addArticle",function(req,res,next){
    if(!req.body.articleTitle){
        res.json({status:1,message:"文章名称为空"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    if(!req.body.articleContext){
        res.json({status:1,message:"文章内容为空"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            console.log(findUser)
            console.log(findUser[0])
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                var saveArticle=new article({
                    articleTitle:req.body.articleTitle,
                    articleContext:req.body.articleContext,
                    articleTime:new Date()
                })
                saveArticle.save(function(err,re){
                    if(err){
                        res.json({status:1,message:err})
                    }else{
                        res.json({status:0,message:"新增成功",data:re})
                    }
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//删除文章
router.post("/delArticle",function(req,res,next){
    if(!req.body.articleId){
        res.json({status:1,message:"文章id传递失败"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                article.remove({_id:req.body.articleId},function(err,delArticle){
                    res.json({status:0,message:"delete success",data:delArticle})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//新增主页推荐
router.post("/addRecommend",function(req,res,next){
    if(!req.body.recommendImg){
        res.json({status:1,message:"推荐图片为空"})
    }
    if(!req.body.recommendSrc){
        res.json({status:1,message:"推荐跳转地址为空"})
    }
    if(!req.body.recommendTitle){
        res.json({status:1,message:"推荐标题为空"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                var saveRecommend=new recommend({
                    recommendImg: req.body.recommendImg,
                    recommendSrc:req.body.recommendSrc,
                    recommendTitle: req.body.recommendTitle
                })
                saveRecommend.save(function(err,data){
                    if(err){
                        res.json({status:1,message:err})
                    }else{
                        res.json({status:0,message:"add recommend success",data:data})
                    }
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})
//删除热点信息
router.post("/delRecommend",function(req,res,next){
    if(!req.body.recommendId){
        res.json({status:1,message:"评论id传递失败"})
    }
    if(!req.body.token){
        res.json({status:1,message:"登录出错"})
    }
    if(!req.body.id){
        res.json({status:1,message:"用户传递错误"})
    }
    if(!req.body.username){
        res.json({status:1,message:"用户名为空"})
    }
    var check=checkAdminPower(req.body.username,req.body.token,req.body.id);
    if(check.error==0){
        user.findByUsername(req.body.username,function(err,findUser){
            if(findUser[0].userAdmin&&!findUser[0].userStop){
                recommend.remove({_id:req.body.recommendId},function(err,delArticle){
                    res.json({status:0,message:"delete recommend success",data:delArticle})
                })
            }else{
                res.json({status:1,message:"用户没有获得权限或者已经停用"})
            }
        })
    }else{
        res.json({status:1,message:check.message})
    }
})

module.exports=router;