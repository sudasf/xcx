var fetch = require('node-fetch');
var config=require('./config')

function weappSession(req,res,next){
	var {code}=req.query
	var {appId,appSecret}=config
	var url=`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
	fetch(url).then((value)=>{
		console.log(value);
		if(value.openid){
			req.wxSession=value
			next()
		}else{
			res.json({
				code:-40029,
				errMsg:"invalid code"
			})
		}
	})
}

module.exports=weappSession