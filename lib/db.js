var mongoose=require('mongoose')
var connectUrl='mongodb://localhost/xcx'

var db=mongoose.connect(connectUrl)
var ObjectId=mongoose.Schema.Types.ObjectId
var Mixed=mongoose.Schema.Types.Mixed

var UserSchema=new mongoose.Schema({
	openid: { type:String,index: true },
	session_key:{
		value:String,
		expires:Number,
	},
	userInfo:{
		nickName:String,
		avatarUrl:String,
		gender:String,
		city:String,
		country:String,
		province:String,
	},
	phone:{ type:String,index: true },
	created_at:{type:Date,default:Date.now},
})

var User=mongoose.model('User',UserSchema)

module.exports={User}