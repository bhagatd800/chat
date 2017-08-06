var mongoose = require('mongoose');


var messageSchema = mongoose.Schema({
  receiverId: { type: String, index:true},
  senderId: { type: String},
  messages: [{
      message: { type: String},
      time: { type: String}
  }]
});


var chatdata = module.exports = mongoose.model('chatdata',messageSchema);

module.exports.saveData = function(data, callback){
console.log(data);
chatdata.update({$or:[{'receiverId':data.receiver_id, 'senderId':data.sender_id},{'receiverId':data.sender_id, 'senderId':data.receiver_id}]},{$addToSet:{'receiverId':data.receiver_id,'senderId':data.sender_id,'messages':data.message}},{upsert:true},callback)

}


module.exports.getData = function(id1,id2, callback){

chatdata.find({$or:[{'receiverId':id1, 'senderId':id2},{'receiverId':id2, 'senderId':id1}]},callback)

}


