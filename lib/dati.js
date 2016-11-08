var userList = {};
var currentRoom={}
var currentStatus=0
var currentQuestion={}


var myRoom="趣味问答房"

var {db,Question,Answer}=require('./db')

function ioConnect(io){
	io.on('connection', function(socket){
		console.log('连接上来',socket.id);
		//用户连接上来
		assignUser(io,socket)

		leaveRoom(io,socket)

		//发送答题结果
		sendAnswer(io,socket)

	})
}

module.exports=ioConnect

//用户连接上来
function assignUser(io,socket){
	socket.on("userInfo",(data)=>{
		var userInfo=data.userInfo

		userList[socket.id]=userInfo
		console.log(userInfo,userList,"连接");
		socket.emit("infoResult",{
			status:1,
			userInfo:userInfo
		})
		//加入房间
		joinRoom(io,socket,myRoom)

		//管理员控制状态
		managerStatus(io,socket)

		

		//得到答题结果
		getAnswer(io,socket)
		
		
	})
}

//加入房间
function joinRoom(io,socket,myRoom){
	socket.join(myRoom)
	socket.emit('roomResult',{room:myRoom})

	currentRoom[socket.id]=myRoom

	socket.broadcast.to(myRoom).emit("roomMessage",{
		userInfo:userList[socket.id],
	})

	//得到该房间的用户
	var totalUsers= roomUsers(io,socket,myRoom)
	//console.log(totalUsers,"加入房间");
	io.emit("roomTotalUsers",{
		roomTotalUsers:totalUsers
	})
}

//离开房间与断开连接
function leaveRoom(io,socket){
	socket.on('disconnect',()=>{
		var myRoom=currentRoom[socket.id]
		socket.leave(myRoom)
		//console.log(myRoom,"离开房间");
		var totalUsers= roomUsers(io,socket,myRoom)
		console.log(userList[socket.id],socket.id,"离开");
		socket.broadcast.to(myRoom).emit('user_leave', {
            leaveUser: userList[socket.id],
            totalUsers:totalUsers
        });

        delete currentRoom[socket.id]
        delete userList[socket.id]
	})
}

//发送与管理状态
function managerStatus(io,socket){
	//原本应发送给该房间的，现发送给所有人
	io.emit("initStatus",{
		status:currentStatus,
	})

	socket.on('managerStatus',(data)=>{
		currentStatus=data.status
		//console.log(data);
		switch(currentStatus) {
			case 0:
				currentQuestion={}
				io.emit("currentStatus",{
					status:0, //空闲中
				})
				break;
			case 1:
				io.emit("currentStatus",{
					status:1, //准备中
				})
				break;
			case 2:
			    currentQuestion=data.currentQuestion
				io.emit("currentStatus",{
					status:2, //答题中
					currentQuestion:currentQuestion
				})
				break;
			case 3:
				io.emit("currentStatus",{
					status:3,
				})
				break;	
			case 4:
				var questionId=currentQuestion._id
				var pici=currentQuestion.pici
				Answer.find({questionId:questionId,pici:pici},function(err,docs){
					if(err){
						console.log(err,"查看答案出错");
						return
					}

					io.emit("currentStatus",{
						status:4, //答题结果
						allAnswer:docs,
						currentQuestion:currentQuestion
					})
					console.log('发送答案'); 	
				})
				break;		
		}
	})
}

//发送答案
function sendAnswer(io,socket){
	socket.on("sendAnswer",(data)=>{
		var {userInfo,questionId,myAnswer,solution,result,pici,begin_time,end_time}=data
		//var userInfo=userList[socket.id]
		var addData={
			userInfo,questionId,myAnswer,solution,result,begin_time,end_time,pici,
		}
		console.log(addData,"发送我的回答",socket.id);
		var addAnswer=new Answer(addData)
		addAnswer.save()
	})
}

//得到答案
function getAnswer(io,socket){
	socket.on("getAnswer",(data)=>{

		var questionId=data.questionId
		var user=userList[socket.id]
		Answer.findOne({"questionId":questionId,"user.openId":user.openId},function(err,doc){
			if(err) return
			socket.emit("getMyAnswer",{myAnswer:doc})	
		})

		Answer.find({questionId:questionId},function(err,docs){
			if(err) return
			socket.emit("getAllAnswer",{allAnswer:docs})	
		})
	})
	
}

//得到该房间的所有用户
function roomUsers(io,socket,myRoom){

	if(!io.sockets.adapter.rooms[myRoom]) return []
	var totalSocketId=io.sockets.adapter.rooms[myRoom].sockets
	var totalUsers=Object.keys(totalSocketId).map((value,index)=>{
		return userList[value]
	})
	return totalUsers
}

