var jwt = require('jwt-simple');
const buf = Buffer.from('sunfeng', 'ascii');
var secret=buf.toString('base64');
var {User}=require('./db')

function checkSession(req,res,next) {

	var wxsession=req.headers.wxsession
	//console.log(req.headers);
	//console.log(wxsession);
	if(wxsession){
		var decodedSession = jwt.decode(wxsession,secret);
		var {_id,expires}=decodedSession
		var currentTime=(new Date()).getTime()
		if(currentTime<=expires){
			User.findOne({_id:_id},(err,doc)=>{
				req.myUser=doc
				next()
			})
		}else{
			res.json({
				code:"-1",
				errMsg:"登陆凭证过期，请重新登陆"
			})
		}
	}else{
		res.json({
			code:"-1",
			errMsg:"无登陆凭证，请重新登陆"
		})
	}
}


function genSession(payload){
	var expires=(new Date()).getTime()+30*1000 //有效期一个月
	var obj=Object.assign(payload,{expires})
	return jwt.encode(obj, secret)
}

module.exports={checkSession,genSession}



