function receiveMessage(objData){
	if(typeof objData.data === 'object'){
		
		var publisher = new Object();
	
		// Publisher Info 
		publisher.pubID = objData.data.MESSAGE.pubID;
		publisher.wsPubID  = objData.data.MESSAGE.wsPubID;
		publisher.sendTime = objData.data.SENDTIME;
		
		// For client info 
		publisher.forUserID = objData.data.MESSAGE.forUserID;
		publisher.wsForClientID  = objData.data.MESSAGE.wsForClientID;
	
		// Extra Info 
		publisher.message = objData.data.MESSAGE.message;
		publisher.msgType = objData.data.MESSAGE.type;
		publisher.channel  = objData.channelname;
		if(typeof objData.data.MESSAGE.ATTR == "undefined"){
			publisher.attr = objData.data.MESSAGE.attr;
		} else { publisher.attr = objData.data.MESSAGE.ATTR; }
		
		//console.log(publisher);
		//console.log(publisher.attr);
	
		if(publisher.pubID != globalUserID){
			switch (publisher.msgType) {
			case "text":		
				if(globalUserID == publisher.forUserID){
					postIncomingMSG(publisher.attr.newMsgID, publisher.message);
				}
				break;
				
			// Initialize Canvas to Draw 	
			case "initDraw":
				postIncomingMSG(publisher.attr.newMsgID, publisher.message);
				initDrawCanvas(publisher.attr.newMsgID);		
				break;

				// Initialize Video Chat 	
			case "initVideo":
		
				break;
				
			// Drawing on Canvas 	
			case "drawing":
				if(publisher.attr.action == 'init'){
					$('#drawPad_' + publisher.attr.newMsgID).signaturePad().regenerate("[" + publisher.message + "]");
				}
				if(publisher.attr.action == 'feedback'){
					var api = $('#drawPad_' + publisher.attr.newMsgID).signaturePad();
					if(publisher.message){
						var sig = api.enable();
					} else { var sig = api.disable(); }
				}
				break;
				
			case "videocall":
				var notID = "notificationBtn_" + publisher.attr.newMsgID;
				var ignoreCallBack = "ignoreVideoCall(" + publisher.attr.newMsgID + ")";
				var acceptCallBack = "confirmVideoCall(" + publisher.attr.newMsgID + ")";
				var message = "<a style='margin-top: -7px;' href='javascript:void(0)' onClick='" + ignoreCallBack + "' class='notify-action' data-uk-tooltip title='ignore..'><i class='md-icon material-icons md-color-white'>&#xE5CD;</i></a> <i class='material-icons md-color-green-500'>&#xE0B0;</i>  " + publisher.message;				
				var notifyBtn = '<button id="' + notID + '" class="md-btn" data-message="' + message + '" data-status="" data-pos="bottom-center" data-callback="' + acceptCallBack + '" data-action="">Click me</button>';				
				$('#page_content').append(notifyBtn);
				$('#notificationBtn_' + publisher.attr.newMsgID).trigger('click');
				break;
			}
		}
		
    } else if (objData.data !== 'FORCE-RECONNECT') {
    	console.log(objData.data);
    }
}

function confirmVideoCall(newMsgID){
	$('#notificationBtn_' + newMsgID).remove();
	postMSGonDemand(newMsgID);	
}

function postMSGonDemand(newMsgID){
	//console.log(newMsgID);
	$('#chatBox').append('<div id="msg' + newMsgID + '"></div>');
	$('#msg' + newMsgID).hide();	
	loadPageToPlaceHolder({ url: '?fa=getVideoElem', placeHolder: 'msg' + newMsgID, Args: { "newMsgID" : newMsgID }, callfunction: 'initAcceptedVideo', loader: 'inline', effect:'none' });	
}

function initAcceptedVideo(params){
	initVideoChat(params.Args.newMsgID, 'join');
}

function ignoreVideoCall(msgID){
	$('#notificationBtn_' + msgID).attr('data-action','ignore').remove();
}

// Post Incoming Message
function postIncomingMSG(newMsgID, message){
	$('#chatBox').append('<div id="msg' + newMsgID + '"></div>');
	$('#msg' + newMsgID).hide();
	$('#msg' + newMsgID).html(message).fadeIn("slow");
	scrollBottom();
}

function parseJSONResponse(message){
    return JSON.stringify(message)
        .replace(/,"/g,',<br />&nbsp;&nbsp;"')
        .replace('{','{<br />&nbsp;&nbsp;')
        .replace('}','<br />}');
}

function writeToConsole(message,classname){
	console.log(message);
	console.log(classname);
}

function clearLog(e){
    UI.console.innerHTML = '';
    e.target.blur();
}

//messagehandler recieves all the messages from websocket
function messageHandler(messageobj) {
    writeToConsole(parseJSONResponse(messageobj), messageobj.type !== 'data' ? 'alert alert-info' : '');
}

//openhandler is invoked when socket connection is
function openHandler(){
    writeToConsole('OPEN HANDLER INVOKED','alert alert-success');
}

//openhandler is invoked when a socket error occurs
function errorHandler(messageobj) {
    writeToConsole(parseJSONResponse(messageobj),'alert alert-warning');
}

function subscribeMe(e){
    e.target.blur();
    if(checkSocketAccess()){
        if (UI.channelname.value === 'chat'){
            if (UI.username.value !== ''){
                mywsobj.authenticate(UI.username.value,'');
                mywsobj.subscribe(UI.channelname.value,{username:UI.username.value});
            } else {
                writeToConsole('Username required when attempting to connect to chat room','alert alert-warning');
            }
        } else {
            mywsobj.subscribe(UI.channelname.value);
        }

    }
}

function getSubscribers(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.getSubscriberCount(UI.channelname.value);
}

function unsubscribeMe(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.unsubscribe(UI.channelname.value);
}

function publish(e){
    e.target.blur();
    if(checkSocketAccess()){
        if (UI.message.value !== ''){
            mywsobj.publish(UI.channelname.value,UI.message.value);
            UI.message.value = '';
        } else {
            writeToConsole('Enter a message to publish','alert alert-danger');
        }
    }
}

function getSubscriptions(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.getSubscriptions();
}

function invokeAndPublish(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.invokeAndPublish(UI.channelname.value, UI.cfcname.value, UI.fnname.value);
}

function invoke(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.invoke(UI.cfcname.value, UI.fnname.value);
}

function openSocket(e){
    e.target.blur();
    writeToConsole('OPENING SOCKET','alert alert-success');
    mywsobj.openConnection();
}

function stopSocket(e){
    e.target.blur();
    writeToConsole('CLOSING SOCKET','alert alert-danger');
    mywsobj.closeConnection();
}

function checkSocket(e){
    e.target.blur();
    if (mywsobj.isConnectionOpen())
        writeToConsole('SOCKET IS OPEN','alert alert-success');
    else
        writeToConsole('SOCKET IS CLOSED','alert alert-danger');
}

function checkSocketAccess(){
    if (mywsobj.isConnected()){
        return true;
    } else {
        writeToConsole('SOCKET IS NOT CONNECTED - FUNCTION COULD NOT BE PROCESSED','alert alert-danger');
        return false;
    }
}









/*

//Get data from the recieved message token
var messageHandler = function(aToken) {
	if(aToken.type == "response") {
		wsResponse(aToken);
	} else if(aToken.type == "data") {
		wsData(aToken);
	}
}

// Server Responses
var wsResponse = function(objData) {
	var clientID = objData.clientid;
	globalWsID = clientID;
	
	switch (objData.reqType) {
		case "welcome":			
			postData({ url:'?fa=ws_welcome', Args: { "clientID" : clientID }, loader: 'inline' });			
			var username = globalUserName;			
			mywsobj.authenticate(username, globalUserID);
		break;
		case "subscribe":
			if(objData.reqType.indexOf("subscribe")!=-1){
				console.log("subscribed!");
			} else {
				console.log("NOT subscribed!");
			}
		break;
		case "authenticate":
			console.log("authenticated!");
		break;		   		
	}	
}

// Users Messages
var wsData = function(objData) {
	var publisher = new Object();

	 Publisher Info 
	publisher.pubID = objData.data.MESSAGE.pubID;
	publisher.wsPubID  = objData.data.MESSAGE.wsPubID;
	publisher.sendTime = objData.data.SENDTIME;
	
	 For client info 
	publisher.forUserID = objData.data.MESSAGE.forUserID;
	publisher.wsForClientID  = objData.data.MESSAGE.wsForClientID;

	 Extra Info 
	publisher.message = objData.data.MESSAGE.message;
	publisher.msgType = objData.data.MESSAGE.type;
	publisher.channel  = objData.channelname;
	if(typeof objData.data.MESSAGE.ATTR == "undefined"){
		publisher.attr = objData.data.MESSAGE.attr;
	} else { publisher.attr = objData.data.MESSAGE.ATTR; }
	
	//console.log(publisher);
	//console.log(publisher.attr);

	if(publisher.pubID != globalUserID){
		switch (publisher.msgType) {
		case "text":		
			if(globalUserID == publisher.forUserID){
				postIncomingMSG(publisher.attr.newMsgID, publisher.message);
			}
			break;
			
		 Initialize Canvas to Draw 	
		case "initDraw":
			postIncomingMSG(publisher.attr.newMsgID, publisher.message);
			initDrawCanvas(publisher.attr.newMsgID);		
			break;
	
		 Drawing on Canvas 	
		case "drawing":
			if(publisher.attr.action == 'init'){
				$('#drawPad_' + publisher.attr.newMsgID).signaturePad().regenerate("[" + publisher.message + "]");
			}
			if(publisher.attr.action == 'feedback'){
				var api = $('#drawPad_' + publisher.attr.newMsgID).signaturePad();
				if(publisher.message){
					var sig = api.enable();
				} else { var sig = api.disable(); }
			}
			break;
		}
	}
}



//Open Handler
var openHandler = function(dataObj) {
	//subscribing to the world by default
	mywsobj.subscribe("chat");
}

// Error messages to mError PlaceHolder
var errorHandler = function(err) {
	console.log(err);
}




function writeToConsole(message,classname){
	console.log(message);
	console.log(classname);
}

function getSubscribers(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.getSubscriberCount(UI.channelname.value);
}

function unsubscribeMe(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.unsubscribe(UI.channelname.value);
}

function publish(e){
    e.target.blur();
    if(checkSocketAccess()){
        if (UI.message.value !== ''){
            mywsobj.publish(UI.channelname.value,UI.message.value);
            UI.message.value = '';
        } else {
            writeToConsole('Enter a message to publish','alert alert-danger');
        }
    }
}

function getSubscriptions(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.getSubscriptions();
}

function invokeAndPublish(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.invokeAndPublish(UI.channelname.value, UI.cfcname.value, UI.fnname.value);
}

function invoke(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.invoke(UI.cfcname.value, UI.fnname.value);
}

function openSocket(e){
    e.target.blur();
    writeToConsole('OPENING SOCKET','alert alert-success');
    mywsobj.openConnection();
}

function stopSocket(e){
    e.target.blur();
    writeToConsole('CLOSING SOCKET','alert alert-danger');
    mywsobj.closeConnection();
}

function checkSocket(e){
    e.target.blur();
    if (mywsobj.isConnectionOpen())
        writeToConsole('SOCKET IS OPEN','alert alert-success');
    else
        writeToConsole('SOCKET IS CLOSED','alert alert-danger');
}

function checkSocketAccess(){
    if (mywsobj.isConnected()){
        return true;
    } else {
        writeToConsole('SOCKET IS NOT CONNECTED - FUNCTION COULD NOT BE PROCESSED','alert alert-danger');
        return false;
    }
}*/