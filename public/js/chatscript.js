var app = angular.module("chat", []);
app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});
app.controller("chatController",['$scope','getuserInfo','getChatInfo','sendMessageInfo', function($scope,getuserInfo,getChatInfo,sendMessageInfo)  {
	$scope.data={
		"message":"",
		"receiverid":""
	}
$scope.getData=function(){
//alert("deepak")
	getuserInfo.getData().then(function(data){
		$scope.userData=data;
		//alert(JSON.stringify($scope.userData))
		
	})
}
$scope.getChatData=function(_id){
	$scope.id=_id;
	getChatInfo.getData(_id).then(function(data){
		$scope.chatData=data[0].messages;
		alert(JSON.stringify($scope.chatData))
		
	})
}
$scope.sendMessage=function(){
	//alert("data")
	$scope.data.receiverid=$scope.id;
	//alert(JSON.stringify($scope.data));
	 sendMessageInfo.sendData($scope.data);
	
}


}])


app.factory("getuserInfo",['$http',function($http){

  return{

    getData:function(){

    datas=$http({

      method: 'GET',

      url: '/chat/getUserData'

  }).then(function(response) {
      return response.data;
    })
    return datas;
   }  
}
}]);


app.factory("getChatInfo",['$http',function($http){

  return{

    getData:function(id){

    datas=$http({

      method: 'GET',

      url: '/chat/getchatdata/'+id

  }).then(function(response) {
      return response.data;
    })
    return datas;
   }  
}
}]);


app.service("sendMessageInfo",['$http',function($http){
return{
	sendData:function(data){

datas=$http({
	url: '/chat/postchatdata',

    method: "POST",

    data: data,

    headers: {

             'Content-Type': 'application/json'

    }

})
}
}
}
]);