var express = require('express');
var router = express.Router();

var  Chat = require('../models/chat');
const User = require('../models/user');

router.get('/getchatpage', function(req, res){

	res.render('chatpage');
});





router.post('/postchatdata',function(req,res){
//console.log(req.body);
var current_time = Date.now();
var messageData={

"sender_id":req.session.users._id,
"receiver_id":req.body.receiverid,
"message":{
	"time": current_time,
	"message":req.body.message
}
}

Chat.saveData(messageData,function(err,cb){

if(cb)
{
	console.log(err);
}
else{
	res.json("updated");
}
})

});


router.get('/getchatdata/:_id',function(req,res){

var senderId=req.params._id;
console.log(senderId);
var receiverId=req.session.users._id;
Chat.getData(senderId,receiverId,function(err,data){

	if(data){
		res.json(data);
	}

})



});


router.get('/getUserData',function(req,res){

User.getUserData(function(err,data){
var temp;
var datas=[];
	if(data){
		for(i=0;i<data.length;i++){

			if(data[i]._id==req.session.users._id){
				continue;
			}
			else{
				temp={
					_id:data[i]._id,
					username:data[i].username

				}
			}
			datas.push(temp);
		}
		console.log(datas)
		res.json(datas);
	}

})

});


module.exports = router;