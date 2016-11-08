var express = require('express');
var router = express.Router();
var weappSession=require('../lib/weappSession')
var {genSession}=require('../lib/mySession')
var {User}=require('../lib/db')

/* GET home page. */
router.get('/',weappSession, function(req, res, next) {
   var wxSession=req.wxSession
   var {openid,session_key,expires_in}=wxSession
   var expires=(new Date()).getTime()+expires_in*1000
   var addData={
   	    openid: openid,
	    session_key:{
			value:session_key,
			expires_in:expires,
		}
   }

   var newUser=new User(addData)

   newUser.save((err)=>{
   		if(err){
   			console.log(err);
   			return res.json({
   				code:-3,
   				errMsg:"数据库存储出错"
   			})
   		}

	   	var _id=newUser._id
	   	var session=genSession({_id})
	   	res.json({
	   	 	code:1,
	   	 	session:session
	   	})
   })
});



module.exports = router;