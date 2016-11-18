PeersRTC = function(rtcOptions){

    this.WebRTC = {

        users: [],
        streams: [{}],
        peerConnections: [],

        peerConnectionConfig : {
            'iceServers': [
                {'urls': 'stun:stun.services.mozilla.com'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        },

        // ---- WebRTC Options ---- /
        options: {
            video: false,
            audio: false,
            datachannel: true
        },

        // ---- Sending Message ---- /
        sendData: function(msg, remoteID){
            trace('Sent Data: ' + msg);
            for (i = 0; i < $this.peerConnections.length; i++) {
                if(remoteID == null){
                    $this.peerConnections[i].sendChannel.send(msg);
                } else {
                    if($this.peerConnections[i].clientID === remoteID){
                        $this.peerConnections[i].sendChannel.send(msg);
                        break;
                    }
                }
            }
        },

        // ---- Recieving Message ---- /
        onReceiveMessageCallback: function(event){
            trace('Received Message');
            if($this.on.message){
                $this.on.message.emit({msg: event.data, remoteID: event.target.label});
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

        createConnection: function(clientID){

            var $peer = $this.getPeerByID(clientID);

            // Creating New Peer if dosn't exist
            if($peer == null){
                $this.peerConnections.push({
                    clientID: clientID,
                    peerConnection: new RTCPeerConnection($this.peerConnectionConfig),
                    dataConstraint: null,
                    receiveChannel: null,
                    sendChannel: null
                });
                $peer = $this.peerConnections[$this.peerConnections.length - 1];
                $peer.peerConnection.clientID = clientID;
            }

            // On Signaling State Change
            $peer.peerConnection.onsignalingstatechange = $this.onsignalingstatechange;

            // On Ice Candidate
            $peer.peerConnection.onicecandidate = $this.gotIceCandidate;

            // Creating Send DataChannel
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

            //window.webSockets.send(JSON.stringify({'event': 'status', 'type': 'datachannel', 'order': 'send', 'state': 'open', 'remoteID': window.clientID, 'forUserID': clientID}));

            return $peer;
        },

        connect: function(forUserID, options){

            var exist$peer = $this.getPeerByID(forUserID);

            if(exist$peer == null){
                //console.warn("1 Creating Peer!");
                var $peer = $this.createConnection(forUserID);
                $this.openConnection($peer, true);
            } else {
                //console.warn("1 Existing Peer!");
                $this.openConnection(exist$peer, true);
            }

        },

        // ---- Opening Connection ---- /
        openConnection: function($peerUser, isCaller, callback){

            if(isCaller == true) {

                console.log("Is Caller");
                if($peerUser.peerConnection.signalingState === 'stable'){
                    $peerUser.peerConnection.createOffer().then(function(description){
                        $this.createdDescription(description, $peerUser);
                    }).catch($this.errorHandler);
                } else {
                    console.warn("Caller Signaling State: " + $peerUser.peerConnection.signalingState);
                }

            } else {

                if ($peerUser.remoteID != window.clientID){

                    //console.warn("Remote Caller: " + $peerUser.remoteID);
                    var exist$peer = $this.getPeerByID($peerUser.remoteID);
                    //console.log(exist$peer);

                    if(exist$peer == null){
                        //console.warn("2 Creating Peer!");
                        $peer = $this.createConnection($peerUser.remoteID);
                        callback($peer);
                    } else {
                        //console.warn("2 Existing Peer!");
                        callback(exist$peer);
                    }

                }

            }

            // if(isCaller == true) {
            //     if($peerUser.peerConnection == null){
            //         console.log($this.peerConnections);
            //         console.log("Removing Garbage!");
            //         $this.removeOBJbyAttr($this.peerConnections, 'remoteID', $peerUser.remoteID);
            //     } else {
            //         if($peerUser.peerConnection.signalingState === 'stable'){
            //             $peerUser.peerConnection.createOffer().then(function(description){
            //                 $this.createdDescription(description, $peerUser);
            //             }).catch($this.errorHandler);
            //         }
            //     }
            // } else {
            //     var exist$peer = $this.getPeerByID($peerUser.remoteID);
            //
            //     if(exist$peer == null){
            //         console.warn("2 Creating Peer!");
            //         $peer = $this.createConnection($peerUser.remoteID);
            //         callback($peer);
            //     } else {
            //         console.warn("2 Existing Peer!");
            //         callback(exist$peer);
            //     }
            //
            // }

        },

        //console.warn("*************");
        //console.warn(this.signalingState);
        //console.warn(event);
        //console.log(this);
        //console.warn("*************");

        // ---- On Peer State Changed ---- /
        onsignalingstatechange: function(event){
            if(this.signalingState === 'stable' || this.signalingState === 'closed'){
                if($this.on.connection){
                    var sendDetails = { 'event': 'status', 'type': 'peer', 'order': 'signaling', 'state': this.signalingState, 'remoteID': this.clientID, 'localID': window.clientID };
                    $this.on.connection.emit(sendDetails);
                }
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

            // console.warn("*************");
            // console.warn(this.readyState);
            // console.warn(event);
            // console.log(this);
            // console.warn("*************");

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
            }
        },

        checkPeerState: function(clientID){
            var $peer = $this.getPeerByID(clientID);
            if($peer.receiveChannel.readyState === 'closed' & $peer.sendChannel.readyState === 'closed'){
                trace("Closing Peer: " + clientID);
                $peer.peerConnection.close();
                $this.removeOBJbyAttr($this.peerConnections, 'clientID', clientID);

                console.warn("Peers Length: " + $this.peerConnections.length);
                console.log($this.peerConnections);

            }
        },

        // ---- On Receive DataChannel State Changed ---- /
        // onReceiveChannelStateChange: function(event){
        //
        //     if(this.readyState === 'open'){
        //         $this.updateUserOptions({'readyState': this.readyState, 'order': 'receive', 'remoteID': this.clientID});
        //     } else if(this.readyState === 'closed') {
        //         // Removing user from PeerConnections
        //         $this.removeOBJbyAttr($this.peerConnections, 'remoteID', this.clientID);
        //         $this.setUserDefaults(this.clientID);
        //     }
        //
        //     if($this.on.status){
        //         var sendDetails = { 'event': 'status', 'type': 'datachannel', 'order': 'receive', 'state': this.readyState, 'remoteID': $peer.remoteID, 'localID': window.clientID };
        //         $this.on.status.emit(sendDetails);
        //     }
        //
        // },

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

        disconnect: function(remoteID, callback){

            // determin remove type
            var removeType = 'single';
            if (typeof remoteID === "function" || remoteID == null) { removeType = 'all'; }

            // close peerConnections
            for (i = 0; i < $this.peerConnections.length; i++) {
                if(removeType === 'single'){
                    $this.closeConnection($this.peerConnections[i]);
                    if (typeof callback === "function") { callback(remoteID); }
                    break;
                } else {
                    $this.closeConnection($this.peerConnections[i]);
                    if (typeof callback === "function") { callback(remoteID); }
                }
            }

        },

        closeConnection: function($peer){

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
                $peer.peerConnection.close();
                trace('Closed peer connections');
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

                if($peer.remoteID != window.clientID){

                    if(signal.sdp) {

                        //console.warn("Signaling sdp... "  + $peer.peerConnection.signalingState);

                        $peer.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
                            // Only create answers in response to offers

                            if(signal.sdp.type == 'offer') {
                                $peer.peerConnection.createAnswer().then(function(description){
                                    $this.createdDescription(description, $peer);
                                }).catch($this.errorHandler);
                            }

                        }).catch($this.errorHandler);

                    } else if(signal.ice) {

                        //console.warn("Signaling ice... " + $peer.peerConnection.signalingState);
                        $peer.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch($this.errorHandler);

                    }

                } else {
                    console.error(" **** We Got Conflict ****");
                    console.error($peer);
                }

            });

        },

        gotIceCandidate: function(event) {
            if(event.candidate != null) {
                window.webSockets.send(JSON.stringify({'event': 'offer', 'ice': event.candidate, 'remoteID': window.clientID, 'forUserID': this.clientID})); //, 'uuid': $this.uuid
            }
        },

        createdDescription: function(description, $peer) {
            $peer.peerConnection.setLocalDescription(description).then(function() {
                window.webSockets.send(JSON.stringify({'event': 'offer', 'sdp': $peer.peerConnection.localDescription, 'remoteID': window.clientID, 'forUserID': $peer.remoteID})); //, 'uuid': $this.uuid
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
            console.log(options.remoteID);
            var $user = $this.getUserByID(options.remoteID);
            $user.options[options.order][options.type] = options.readyState
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
        onAddUserInfo: function(data){
            if(data.forUserID){
                var sendMsg = {'event': 'system', type : "remote", status: "connected", 'localID':  window.clientID, 'remoteID': data.remoteID};
                if($this.on.system){ $this.on.system.emit(sendMsg); }
            }
            $this.addUserInfo(data);
        },

        onSystem: function(data){

            // Send Local Options ON STARTUP to Everyone
            if(data.type === 'local' & data.status === 'connected'){
                var sendMsg = {'event': 'usersInfo', 'remoteID': window.clientID, 'options': $this.options};
                window.webSockets.send(JSON.stringify(sendMsg));
            }

            // Send Local Options to NEW remote User
            if(data.type === 'remote'){
                if(data.status === 'connected'){
                    var sendMsg = {'event': 'usersInfo', 'forUserID': data.remoteID, 'remoteID': window.clientID, 'options': $this.options};
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
