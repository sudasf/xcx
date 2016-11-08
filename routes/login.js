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

   User.findOne({openid:openid},(err,doc)=>{
   		if(err){
   			console.log(err);
   			return res.json({
   				code:-4,
   				errMsg:"数据库查询出错"
   			})
   		}

   		if(doc){
   			console.log(doc,"已有用户");
   			doc.session_key=session_key
   			doc.save((err)=>{
   				let _id=doc._id
			   	let session=genSession({_id})
			   	res.json({
			   	 	code:1,
			   	 	data:session
			   	})
   			})
   		}else{
   			  var addData={
			   	    openid: openid,
				    session_key:{
						value:session_key,
						expires_in:expires,
					}
			   }
			   var newUser=new User(addData)
			        newUser.save((err)=>{
			   		console.log(newUser,"新增用户");
			   		if(err){
			   			console.log(err);
			   			return res.json({
			   				code:-3,
			   				errMsg:"数据库存储出错"
			   			})
			   		}

				   	let _id=newUser._id
				   	let session=genSession({_id})
				   	res.json({
				   	 	code:1,
				   	 	data:session
				   	})
			   })
   		}
   })

});



module.exports = router;