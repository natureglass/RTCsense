PeersRTC = function(rtcOptions){

    this.WebRTC = {

        users: [],
        streams: [{}],
        peerConnections: [],

        watingList: [],
        connStatus: "ready",

        peerConnectionConfig : {
            'iceServers': [
                {'urls': 'stun:stun.services.mozilla.com'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        },

        // ---- WebRTC Options ---- /
        options: {
            video: { send: false, receive : false },
            audio: { send: false, receive : false }
        },

        // ---- Sending Message ---- /
        sendData: function(msg, clientID){

            var $errorPeer;

            for (i = 0; i < $this.peerConnections.length; i++) {

                if( $this.peerConnections[i].peerConnection.signalingState === 'stable' &
                    $this.peerConnections[i].sendChannel.readyState === 'open') {

                    trace('Sending to ' + $this.peerConnections[i].clientID +' Data: ' + msg);

                    if(clientID == null){

                        // Sending to Everyone
                        $this.peerConnections[i].sendChannel.send(msg);

                    } else {

                        // Sending to clientID
                        if($this.peerConnections[i].clientID === clientID){
                            $this.peerConnections[i].sendChannel.send(msg);
                            break;
                        }

                    }

                } else if($this.peerConnections[i].receiveChannel === null) {

                    $errorPeer = $this.peerConnections[i];

                } else {

                    console.warn('***********************');
                    console.warn('Cant send Data to: ' + $this.peerConnections[i].clientID);
                    console.warn('*********************** ' + $this.peerConnections[i].peerConnection.signalingState);

                    $this.iceRestart($this.peerConnections[i]);

                }

            }

            if($errorPeer){ // Restart existing Peer

                console.warn('*********************** RECONNECTING PEEER');
                var initiated = new Date().valueOf() - $errorPeer.timestamp;
                if(initiated > 3000){
                    console.warn('*********************** Sending Disconnect');
                    $this.remoteCommand($errorPeer.clientID, 'disconnect');
                    $errorPeer.timestamp = new Date().valueOf();
                } else {
                    console.log(initiated);
                }

            }

        },

        // ---- Recieving Message ---- /
        onReceiveMessageCallback: function(event){
            trace('Received Message from: ' + this.clientID);
            if($this.on.message){
                $this.on.message.emit({msg: event.data, clientID: this.clientID});
            }
        },

        getUsers: function(callback){
            $this.getJSON('?fa=getUsers', { id: window.clientID }).then(function(users) {
                callback(users);
            }, function(status) {
                trace('Error on getting Users..');
            });
        },

// ---------------------------------------------------------------------- //

        connect: function(forUserID, options){

            $this.watingList.push(forUserID);

            if($this.connStatus === "ready"){

                $this.connStatus = "connecting";

                var $peer = $this.getPeerByID(forUserID);

                if($peer == null){

                    // Creating New Peer
                    $peer = $this.createConnection(forUserID);
                    $this.openConnection($peer, true, function(signalingState){

                        if(signalingState === 'stable'){
                            console.warn(" ******* Success Signaling ******* ");
                        } else { console.warn(" ******* signalingState Failed: " + signalingState); }

                    });

                } else if($peer.peerConnection.iceConnectionState === 'failed'){

                    // Restarting ICE
                    $this.iceRestart($peer);

                } else if($peer.receiveChannel) {

                    if($peer.sendChannel.readyState === 'open' & $peer.receiveChannel.readyState === 'open'){

                        // Restarting ICE
                        $this.iceRestart($peer);

                    } else {

                        console.warn("************ this 1");
                        // Restart existing Peer
                        $this.reconnectPeer($peer.clientID);

                    }

                } else {

                    console.warn("************ this 2");
                    // Restart existing Peer
                    $this.reconnectPeer($peer.clientID);

                }

            }

        },

        iceRestart: function($peer){


            var initiated = new Date().valueOf() - $peer.timestamp;
            if(initiated > 3000){

                $peer.timestamp = new Date().valueOf();

                // Renegotiate exisitng Peer
                var offerOptions = { iceRestart:true };
                $this.openConnection($peer, true, function(signalingState){

                    if(signalingState === 'stable'){

                        if($this.on.connection){
                            var sendDetails = { 'event': 'status', 'type': 'peer', 'order': 'ICE restart', 'state': 'renegotiate', 'remoteID': $peer.clientID, 'localID': window.clientID };
                            $this.on.connection.emit(sendDetails);
                        }

                    } else {

                        console.warn($peer.clientID + " ******* signalingState Failed: " + signalingState);
                        $this.reconnectPeer($peer.clientID);

                    }

                }, offerOptions);

            } else {
                console.log(initiated);
            }

        },

        createConnection: function(clientID){

            $this.peerConnections.push({
                clientID: clientID,
                timestamp: new Date().valueOf(),
                peerConnection: new RTCPeerConnection($this.peerConnectionConfig),
                dataConstraint: null,
                receiveChannel: null,
                sendChannel: null
            });

            $peer = $this.peerConnections[$this.peerConnections.length - 1];
            $peer.peerConnection.clientID = clientID;

            // On Signaling State Change
            $peer.peerConnection.onsignalingstatechange = $this.onsignalingstatechange;

            // On Ice Candidate
            $peer.peerConnection.onicecandidate = $this.gotIceCandidate;
            $peer.peerConnection.oniceconnectionstatechange = $this.oniceconnectionstatechange;

            // If Negotiation is Needed
            $peer.peerConnection.onnegotiationneeded = $this.onnegotiationneeded;

            // Streams & Tracks
            $peer.peerConnection.onremovestream = $this.onremovestream;
            $peer.peerConnection.ontrack = $this.ontrack;

            // DataChannel
            $peer.sendChannel = $peer.peerConnection.createDataChannel("main_SendReceive", $peer.dataConstraint);
            $peer.sendChannel.clientID = clientID;
            $peer.sendChannel.onopen = $this.onSendChannelStateChange;
            $peer.sendChannel.onclose = $this.onSendChannelStateChange;

            // On DataChannel Creation
            $peer.peerConnection.ondatachannel = function(event){

                trace('Received Channel Callback');

                $peer.receiveChannel = event.channel;
                $peer.receiveChannel.clientID = this.clientID;
                $peer.receiveChannel.onmessage = $this.onReceiveMessageCallback;
                $peer.receiveChannel.onopen = $this.onReceiveChannelStateChange;
                $peer.receiveChannel.onclose = $this.onReceiveChannelStateChange;

            }

            return $peer;
        },

        // ---- Opening Connection ---- /
        openConnection: function($peerUser, isCaller, callback, offerOptions){

            if(isCaller == true) {

                trace("Creating Offer to: " + $peerUser.clientID);

                if($peerUser.peerConnection.signalingState === 'stable'){
                    $peerUser.peerConnection.createOffer(offerOptions).then(function(description){
                        $this.createdDescription(description, $peerUser);
                    }).catch($this.errorHandler);

                    // Return Stable for Success
                    callback($peerUser.peerConnection.signalingState);

                } else {

                    console.warn('Its not stable!');
                    // Return having-offer for failure
                    callback($peerUser.peerConnection.signalingState);
                }

            } else {

                if ($peerUser.remoteID != window.clientID){

                    var $peer = $this.getPeerByID($peerUser.remoteID);

                    if($peer == null){

                        $peer = $this.createConnection($peerUser.remoteID);
                        callback($peer);

                    } else { callback($peer); }

                }

            }

        },

        onnegotiationneeded: function(event){
            console.warn('onnegotiationneeded, signalingState: ' + this.signalingState);
        },

        // ---- On Peer State Changed ---- /
        onsignalingstatechange: function(event){

            if(this.signalingState === 'stable' || this.signalingState === 'closed'){
                if($this.on.connection){
                    var sendDetails = { 'event': 'status', 'type': 'peer', 'order': 'signaling', 'state': this.signalingState, 'remoteID': this.clientID, 'localID': window.clientID };
                    $this.on.connection.emit(sendDetails);
                }

                // Removing PeerConnection[]
                if(this.signalingState === 'closed'){
                    var $peers = $this.removeOBJbyAttr($this.peerConnections, 'clientID', this.clientID);
                }

                if(this.signalingState === 'stable'){
                    $this.removeWatingList(this.clientID);
                    $this.connStatus = "ready";
                    $this.checkWatingUsers();
                }

            } else {
                trace(this.signalingState);
            }

        },

        // ---- On Send DataChannel State Changed ---- /
        onSendChannelStateChange: function(event){

            trace("Send DataChannel is: " + this.readyState);

            if(this.readyState === 'open' || this.readyState === 'closed'){

                // Update Users[] DataChannel Peer Send State
                $this.updateUserOptions({'type': 'datachannel', 'readyState': this.readyState, 'order': 'send', 'remoteID': this.clientID});

                // Emit Send State Change
                if($this.on.connection){
                    var sendDetails = { 'event': 'status', 'type': 'datachannel', 'order': 'send', 'state': this.readyState, 'remoteID': this.clientID, 'localID': window.clientID };
                    $this.on.connection.emit(sendDetails);
                }
            }
        },

        // ---- On Receive DataChannel State Changed ---- /
        onReceiveChannelStateChange: function(event){

            trace("Receive DataChannel is: " + this.readyState);

            if(this.readyState === 'open' || this.readyState === 'closed'){

                if(this.readyState === 'closed'){ $this.checkPeerState(this.clientID); }

                // Update Users[] DataChannel Peer receive State
                $this.updateUserOptions({'type': 'datachannel', 'readyState': this.readyState, 'order': 'receive', 'remoteID': this.clientID});

                // Emit Send State Change
                if($this.on.connection){
                    var sendDetails = { 'event': 'status', 'type': 'datachannel', 'order': 'receive', 'state': this.readyState, 'remoteID': this.clientID, 'localID': window.clientID };
                    $this.on.connection.emit(sendDetails);
                }

                if(this.readyState === 'open'){

                    $this.removeWatingList(this.clientID);
                    $this.checkWatingUsers();

                }

            }
        },

        checkWatingUsers: function(){

            if($this.watingList.length != 0){
                var waitingUserID = $this.watingList[0];

                console.warn($this.watingList);
                console.warn("********* connecting to: " + waitingUserID);

                $this.connStatus = "ready";
                $this.connect(waitingUserID);
            }

        },

        onremovestream: function(event){
            console.warn('******* onremovestream *******');
            console.log(event);
        },

        ontrack: function(event){
            console.warn('******* ontrack *******');
            console.log(event);
        },

        checkPeerState: function(clientID){
            var $peer = $this.getPeerByID(clientID);
            if($peer){

                if($peer.peerConnection.signalingState === 'have-local-offer'){

                    console.warn('***********************');
                    console.warn('signalingState Still Got have-local-offer: ' + $peer.clientID);
                    console.warn('***********************');

                    $this.iceRestart($this.peerConnections[i]);


                } else if($peer.receiveChannel != null){
                    trace("Closing Peer: " + clientID);
                    $peer.peerConnection.close();
                }
            }
        },

        removeOBJbyAttr: function(arr, attr, value){
            var i = arr.length;
            while(i--){
               if( arr[i]
                   && arr[i].hasOwnProperty(attr)
                   && (arguments.length > 2 && arr[i][attr] === value ) ){
                   arr.splice(i,1);
               }
            }
            return arr;
        },

        reconnectPeer: function(clientID){

            console.warn('Reconnecting Peer: ' + clientID);

            $this.disconnect(clientID, function(){
                setTimeout(function(){
                    //$this.removeWatingList(clientID);
                    //$this.connStatus = "ready";
                    //$this.connect(clientID);
                    $this.remoteCommand(clientID, 'disconnect');
                }, 3000);
            });

        },

        remoteCommand: function(clientID, command){

            var sendDetails;

            // Ask Remote Peer for a New Offer
            if(command === 'disconnect'){

                sendDetails = { 'event': 'status', 'type': 'peer', 'order': 'signaling', 'state': 'reconnecting', 'remoteID': $peer.clientID, 'localID': window.clientID };

                $this.disconnect(clientID, function(){
                    console.warn('******** SENDING DISCONNECT');
                    var sendMsg = {'event': 'usersInfo', 'type': command, 'forUserID': clientID ,'remoteID': window.clientID };
                    window.webSockets.send(JSON.stringify(sendMsg));
                });

            // Ask Remote Peer to Disconnect
            } else if(command === 'offer'){

                sendDetails = { 'event': 'status', 'type': 'peer', 'order': 'ICE restart', 'state': 'renegotiate', 'remoteID': $peer.clientID, 'localID': window.clientID };

                console.warn('******** ASKING FOR NEW OFFER');
                var sendMsg = {'event': 'usersInfo', 'type': command, 'forUserID': clientID ,'remoteID': window.clientID };
                window.webSockets.send(JSON.stringify(sendMsg));

            }

            if($this.on.connection & sendDetails){
                $this.on.connection.emit(sendDetails);
            }

        },

        disconnect: function(remoteID, callback){

            // Determin remove type
            var removeType = 'single';
            if (typeof remoteID === "function" || remoteID == null) { removeType = 'all'; }

            if(removeType === 'single'){

                var foundPeer = false;

                for (i = 0; i < $this.peerConnections.length; i++) {
                    if($this.peerConnections[i].clientID === remoteID){
                        $this.closeConnection($this.peerConnections[i], function(){
                            if(typeof callback === "function"){ callback(remoteID); }
                        });
                        foundPeer = true;
                        break;
                    }
                }

                if(!foundPeer){
                    if(typeof callback === "function"){ callback(remoteID); }
                }

            } else {

                // Clearing wating List
                $this.watingList = [];
                $this.connStatus = "ready";

                // Closing all Peers
                var i = $this.peerConnections.length;
                while(i--){
                    console.log($this.peerConnections[i].clientID);
                    $this.closeConnection($this.peerConnections[i]);
                }

            }

        },

        closeConnection: function($peer, callback){

            if($peer.sendChannel){
                if($peer.sendChannel != null) {
                    $peer.sendChannel.close();
                }
                trace('Closed DataChannel with label: ' + $peer.sendChannel.label);
            }

            if($peer.receiveChannel){
                if($peer.receiveChannel != null) {
                    $peer.receiveChannel.close();
                }
                trace('Closed DataChannel with label: ' + $peer.receiveChannel.label);
            }

            if($peer.peerConnection != null) {
                trace("Closing Peer: " + clientID);
                $peer.peerConnection.close();
            }

            if(typeof callback === "function"){
                callback($peer);
            }

        },

        getPeerByID: function(peerID){
            var $peer = null;
            for (i = 0; i < $this.peerConnections.length; i++) {
                if($this.peerConnections[i].clientID === peerID){
                    $peer = $this.peerConnections[i];
                    break;
                }
            }
            return $peer;
        },

        removeWatingList: function(clientID){

            var index = $this.watingList.indexOf(clientID);

            if (index > -1) {
                console.warn("removing: " + $this.watingList[index]);
                $this.watingList.splice(index, 1);
            } else {
                console.warn('*********** Not removed! ' + $this.watingList[index]);
            }

        },

        getUserByID: function(peerID){
            var $user = null;
            for (i = 0; i < $this.users.length; i++) {
                if($this.users[i].clientID === peerID){
                    $user = $this.users[i];
                    break;
                }
            }
            return $user;
        },

        // --------------------- Processing SDP offer Respone ------------------------- //

        processOffer: function(signal){

            $this.openConnection(signal, false, function($peer){

                if(signal.ice) {

                    trace("Processing ICE Offer from: " + $peer.clientID + " / signalingState: " + $peer.peerConnection.signalingState);

                    if($peer.peerConnection.remoteDescription){
                        $peer.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(function(error){$this.errorHandler});
                    } else {

                        console.warn('******************');
                        console.warn('*** ICE FAILED *** ' + $peer.peerConnection.iceConnectionState);
                        console.warn('******************');

                        console.warn("*** remoteDescription is EMPTY ***");

                        $this.disconnect($peer.clientID, function(){
                            console.warn('*** DISCONNECTED AFER SDP FAILED *** ');
                        });

                    }

                } else if(signal.sdp) {

                    trace("Processing SDP Offer from: " + $peer.clientID + " / signalingState: " + $peer.peerConnection.signalingState);

                    $peer.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {

                        // Only create answers in response to offers
                        if(signal.sdp.type == 'offer') {
                            $peer.peerConnection.createAnswer().then(function(description){

                                var iceState = $peer.peerConnection.iceConnectionState;

                                if(iceState === 'failed'){

                                    console.warn('******************');
                                    console.warn('*** SDP FAILED *** ' + iceState);
                                    console.warn('******************');

                                    $this.disconnect($peer.clientID, function(){
                                        console.warn('*** DISCONNECTED AFER SDP FAILED *** ');
                                    });

                                } else {

                                    $this.createdDescription(description, $peer);

                                }

                            }).catch($this.errorHandler);
                        }

                    }).catch($this.errorHandler);
                }

            });

        },

        oniceconnectionstatechange: function(event){
            trace('oniceconnectionstatechange, signalingState: ' + this.signalingState);
        },

        gotIceCandidate: function(event) {
            if(event.candidate != null) {
                window.webSockets.send(JSON.stringify({'event': 'offer', 'ice': event.candidate, 'remoteID': window.clientID, 'forUserID': this.clientID})); //, 'uuid': $this.uuid
            }
        },

        createdDescription: function(description, $peer) {
            $peer.peerConnection.setLocalDescription(description).then(function() {
                window.webSockets.send(JSON.stringify({'event': 'offer', 'sdp': $peer.peerConnection.localDescription, 'remoteID': window.clientID, 'forUserID': $peer.clientID})); //, 'uuid': $this.uuid
            }).catch($this.errorHandler);
        },

        errorHandler: function(error) {
            var msg = error.toString()
            if($this.on.error){
                var sendDetails = {'event': 'error', 'type': 'local', 'localID': window.clientID, 'error': msg };
                $this.on.error.emit(sendDetails);
            }
            window.webSockets.send(JSON.stringify({'event': 'error', 'type': 'remote', 'remoteID': window.clientID, 'error': msg }));
        },

        checkPeerConnection: function(userID){
            var exists = false;
            for (i = 0; i < $this.peerConnections.length; i++) {
                if($this.peerConnections[i].clientID === userID){
                    exists = true; break;
                }
            }
            return exists;
        },

        updateUserOptions: function(options){
            var $user = $this.getUserByID(options.remoteID);
            if($user){ $user.options[options.order][options.type] = options.readyState }
        },

        createUUID: function() {
            // Taken from http://stackoverflow.com/a/105074/515584
            // Strictly speaking, it's not a real UUID, but it gets the job done here
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },

        on: function(param, callback){
            $this.on[param] = {
                emit: function(data){
                    callback(data);
                }
            };
        },

        startUserMedia: function(constraints){
            if(navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
                    if($this.on.stream){
                        $this.localStream = stream;
                        var streamDetails = {'event': 'local', 'localID': window.clientID, 'stream': stream};
                        $this.on.stream.emit(streamDetails);
                    }
                }).catch($this.errorHandler);

            } else {
                errorHandler('Your browser does not support getUserMedia API');
            }
        },

        gotRemoteStream: function(event){
            $this.sortStream2user({ 'type': 'stream', 'streamID': event.stream.id, 'stream': event.stream });
        },

        sortStream2user: function(data){
            var userExist = false;
            for (i = 0; i < $this.streams.length; i++) {
                if($this.streams[i].streamID === data.streamID){
                    if(data.type === 'stream'){
                        $this.streams[i].stream = data.stream;
                    } else {
                        $this.streams[i].streamID = data.streamID;
                        $this.streams[i].remoteID = data.remoteID;
                    } userExist = true;

                    if($this.on.stream){
                        $this.on.stream.emit($this.streams[i]);
                    }

                    break;
                }
            }

            if(!userExist){
                if(data.type === 'stream'){ $this.streams.push(data);
                } else { $this.streams.push(data); }
            }
        },

        addUserInfo: function(data){

            var initOptions = {
                send : { video: null, audio: null, datachannel: null },
                receive: { video: null, audio: null, datachannel: null }
            }

            var userExist = false;
            for (i = 0; i < $this.users.length; i++) {
                if($this.users[i].clientID === data.remoteID){
                    $this.users[i].options = initOptions;
                    userExist = true;
                    break;
                }
            }

            if(!userExist){
                $this.users.push({
                    clientID: data.remoteID,
                    options: initOptions
                });
            }


        },

        getJSON: function(url, attr) {
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('get', url + $this.obj_to_query(attr), true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    var status = xhr.status;
                    if (status == 200) {
                        resolve(xhr.response);
                    } else {
                        reject(status);
                    }
                };
                xhr.send();
            });
        },

        obj_to_query: function(obj) {
            var parts = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
                }
            }
            return "&" + parts.join('&');
        }

    }; $this = this.WebRTC;

    window.PeersRTC = {

        processOffer: function(signal){
            $this.processOffer(signal);
        },

        // onStatus: function(status){
        //     if(status.type === 'stream'){
        //         $this.sortStream2user({ 'type': 'id', 'streamID': status.streamID, 'remoteID': status.remoteID });
        //     } else {
        //         if($this.on.status){ $this.on.status.emit(status); }
        //     }
        // },

        // Emit Remote Users
        onUserInfo: function(data){

            // Adding UserInfo to users[]
            if(data.type === 'info'){
                $this.addUserInfo(data);
            }

            if(data.forUserID){

                if(data.type === 'info'){

                    // New User Info to system
                    var sendMsg = {'event': 'system', type : "remote", status: "connected", 'localID':  window.clientID, 'remoteID': data.remoteID};
                    if($this.on.system){ $this.on.system.emit(sendMsg); }

                } else if(data.type === 'disconnect'){

                    // Remote User asked to disconnect
                    $this.disconnect(data.remoteID, function(){
                        console.warn(' ********** DISCONNECTED ************ ');
                        var sendMsg = {'event': 'usersInfo', 'type': 'reconnect', 'forUserID': data.remoteID ,'remoteID': window.clientID };
                        window.webSockets.send(JSON.stringify(sendMsg));
                    });

                } else if(data.type === 'reconnect'){

                    // Remote User asked to reconnect
                    console.warn(' ********** RECONNECTING ************ ');

                    $this.removeWatingList(data.remoteID);
                    $this.connStatus = "ready";
                    $this.connect(data.remoteID);

                } else if(data.type === 'offer'){

                    console.warn(' ********** CREATING NEW OFFER ************ ');
                    var $peer = $this.getPeerByID(data.remoteID);

                    // Renegotiate exisitng Peer
                    iceRestart($peer)

                }

            }

        },

        onSystem: function(data){

            // Send Local Options ON STARTUP to Everyone
            if(data.type === 'local' & data.status === 'connected'){
                var sendMsg = {'event': 'usersInfo', 'type': 'info', 'remoteID': window.clientID, 'options': $this.options};
                window.webSockets.send(JSON.stringify(sendMsg));
            }

            // Send Local Options to NEW remote User
            if(data.type === 'remote'){
                if(data.status === 'connected'){
                    var sendMsg = {'event': 'usersInfo', 'type': 'info', 'forUserID': data.remoteID, 'remoteID': window.clientID, 'options': $this.options};
                    window.webSockets.send(JSON.stringify(sendMsg));
                } else if(data.status === 'disconnected'){
                    // Removing User[] Peer
                    $this.removeOBJbyAttr($this.users, 'clientID', data.remoteID);
                }
            }
            if($this.on.system){ $this.on.system.emit(data); }

        },

        onError: function(error){
            if($this.on.error){
                $this.on.error.emit(error);
            }
        }

    }

    return $this;
};
