var express = require('express');
var router = express.Router();
var {User}=require('../lib/db')
var {checkSession}=require('../lib/mySession')

/* GET users listing. */
router.post('/update',checkSession, function(req, res, next) {
   var {userInfo,nickName,avatarUrl,gender,province,city,country}=req.body
   var updateData={
   	 userInfo,nickName,avatarUrl,gender,province,city,country
   }
   var myUser=req.myUser
   console.log(myUser);
   myUser.userInfo=updateData
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

module.exports = router;
