var express = require('express');
var router = express.Router();
var {User}=require('../lib/db')
var {checkSession}=require('../lib/mySession')

/* GET users listing. */
router.post('/update',checkSession, function(req, res, next) {

    console.log(req.body,"我的body");

   var {nickName,avatarUrl,gender,province,city,country}=req.body
   var updateData={
   	 nickName,avatarUrl,gender,province,city,country
   }
   var myUser=req.myUser

   

   myUser.userInfo=updateData

   console.log(myUser,"haha");

   myUser.save((err)=>{
   	    if(err){
   			console.log(err);
   			return res.json({
   				code:-3,
   				errMsg:"数据库存储出错"
   			})
   		}

   	    res.json({
	   	 	code:1,
	    })	
   })
});

router.post('/add',function(req,res,next){
	console.log(req.body,"我的body");
	res.json({
		data:req.body
	})
})

module.exports = router;
