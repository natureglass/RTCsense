function receiveMessage(objData){
	if(typeof objData.data === 'object'){

		console.log(objData.data);
        //var publisher = new Object();

		// Publisher Info
		// publisher.pubID = objData.data.MESSAGE.pubID;
		// publisher.wsPubID  = objData.data.MESSAGE.wsPubID;
		// publisher.sendTime = objData.data.SENDTIME;
		//
		// // For client info
		// publisher.forUserID = objData.data.MESSAGE.forUserID;
		// publisher.wsForClientID  = objData.data.MESSAGE.wsForClientID;
		//
		// // Extra Info
		// publisher.message = objData.data.MESSAGE.message;
		// publisher.msgType = objData.data.MESSAGE.type;
		// publisher.channel  = objData.channelname;
		// if(typeof objData.data.MESSAGE.ATTR == "undefined"){
		// 	publisher.attr = objData.data.MESSAGE.attr;
		// } else { publisher.attr = objData.data.MESSAGE.ATTR; }
		//
        // console.log(publisher);
        // console.log(publisher.attr);

    }
}
