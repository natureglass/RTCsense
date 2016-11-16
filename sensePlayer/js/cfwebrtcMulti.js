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
        sendData: function(msg){
            trace('Sent Data: ' + msg);
            // send to all peers?
            //$this.sendChannel.send(msg);

            for (i = 0; i < $this.peerConnections.length; i++) {
                $this.peerConnections[i].sendChannel.send(msg);
            }
        },

        // ---- Recieving Message ---- /
        onReceiveMessageCallback: function(event){
            trace('Received Message');
            if($this.on.message){
                $this.on.message.emit({msg: event.data, remoteID: event.target.label});
            }
        },

        // ---- DataChannel CallBack ---- /
        receiveChannelCallback: function(event, $peer){
            trace('Receive Channel Callback');
            $peer.receiveChannel = event.channel;
            $peer.receiveChannel.onmessage = $this.onReceiveMessageCallback;
            $peer.receiveChannel.onopen = function(){ $this.onReceiveChannelStateChange($peer); }
            $peer.receiveChannel.onclose = function(){ $this.onReceiveChannelStateChange($peer); }
            //$this.onReceiveChannelStateChange($peer);
        },

        getUsersInfo: function(){
            window.webSockets.send(JSON.stringify({'event': 'info'}));
        },

        getUsers: function(callback){
            $this.getJSON('?fa=getUsers', { id: window.clientID }).then(function(users) {
                callback(users);
            }, function(status) {
                trace('Error on getting Users..');
            });
        },

        createConnection(forUserID){
            $this.peerConnections.push({
                remoteID: forUserID,
                peerConnection: new RTCPeerConnection($this.peerConnectionConfig),
                dataConstraint: null,
                receiveChannel: null,
                sendChannel: null,
                options : {
                    send : { video: false, audio: false, data: false },
                    receive: { video: false, audio: false, data: false }
                }
            });

            var $peer = $this.peerConnections[$this.peerConnections.length - 1];

            $peer.peerConnection.onicecandidate = function(event){ $this.gotIceCandidate(event, forUserID); }

            $peer.sendChannel = $peer.peerConnection.createDataChannel("main_SendReceive", $peer.dataConstraint);
            $peer.sendChannel.onopen = $this.onSendChannelStateChange($peer);
            $peer.sendChannel.onclose = $this.onSendChannelStateChange($peer);

            $peer.peerConnection.ondatachannel = function(event){
                $this.updatePeerOptions({'readyState': $peer.sendChannel.readyState, 'order': 'send', 'remoteID': forUserID});
                $this.receiveChannelCallback(event, $peer);
            }

            window.webSockets.sendTo(JSON.stringify({'event': 'status', 'type': 'datachannel', 'order': 'send', 'state': 'open', 'remoteID': window.clientID, 'forUserID': forUserID}));

            return $peer;
        },

        connect: function(forUserID, options){
            var isConnected = $this.checkPeerConnection(forUserID);
            if(!isConnected){
                var $peer = $this.createConnection(forUserID);
                $this.openConnection($peer, true);
            } else {
                $this.errorHandler('already Connected!');
            }
        },

        // ---- Opening Connection ---- /
        openConnection: function($peerUser, isCaller){

            if(isCaller == true) {

                console.log("Caller: " + $peerUser.remoteID);

                $peerUser.peerConnection.createOffer().then(function(description){
                    $this.createdDescription(description, $peerUser.remoteID, $peerUser);
                }).catch($this.errorHandler);

            } else {

                var $peer = $this.getPeerByID($peerUser.remoteID);

                if($peer == null){
                    $peer = $this.createConnection($peerUser.remoteID);
                }

                //console.log("NOT Caller: " + $peer.remoteID);
                return $peer;
            }

        },

        // ---- On Send DataChannel State Changed ---- /
        onSendChannelStateChange: function($peer){
            var readyState = $peer.sendChannel.readyState;
            var sendDetails = { 'event': 'status', 'type': 'datachannel', 'order': 'send', 'state': readyState, 'remoteID': $peer.remoteID, 'localID': window.clientID };
            if($this.on.status){
                $this.on.status.emit(sendDetails);
            }

        },

        // ---- On Receive DataChannel State Changed ---- /
        onReceiveChannelStateChange: function($peer){
            $this.updatePeerOptions({'readyState': $peer.receiveChannel.readyState, 'order': 'receive', 'remoteID': $peer.remoteID});
            var readyState = $peer.receiveChannel.readyState;
            var sendDetails = { 'event': 'status', 'type': 'datachannel', 'order': 'receive', 'state': readyState, 'remoteID': $peer.remoteID, 'localID': window.clientID };
            if($this.on.status){
                $this.on.status.emit(sendDetails);
            }
        },

        // ---- Closing Connection ---- /
        closeConnection: function(){
            // if($this.peerConnection != null){
            //
            //     if($this.sendChannel){
            //         trace('Closing data channels');
            //         if($this.sendChannel != null) { $this.sendChannel.close(); }
            //         trace('Closed data channel with label: ' + $this.sendChannel.label);
            //         if($this.receiveChannel != null) { $this.receiveChannel.close(); }
            //         trace('Closed data channel with label: ' + $this.receiveChannel.label);
            //     }
            //
            //     if($this.peerConnection != null) {
            //         $this.peerConnection.close();
            //         $this.peerConnection = null;
            //         trace('Closed peer connections');
            //         //window.webSockets.send(JSON.stringify({'event': 'status', 'type': 'stream', 'state': 'close', 'order': 'remote', 'remoteID': window.clientID }));
            //     }
            //
            // }
        },

        getPeerByID: function(peerID){
            var $peer = null;
            for (i = 0; i < $this.peerConnections.length; i++) {
                //console.warn($this.peerConnections[i].remoteID + " - " + peerID);
                if($this.peerConnections[i].remoteID === peerID){
                    $peer = $this.peerConnections[i];
                    break;
                }
            }
            return $peer;
        },

        // --------------------- Processing SDP offer Respone ------------------------- //

        processOffer: function(signal){

            var $peer = $this.openConnection(signal, false);

            if(signal.sdp) {
                $peer.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
                    // Only create answers in response to offers
                    if(signal.sdp.type == 'offer') {
                        $peer.peerConnection.createAnswer().then(function(description){
                            $this.createdDescription(description, signal.remoteID, $peer);
                        }).catch($this.errorHandler);
                    }
                }).catch($this.errorHandler);
            } else if(signal.ice) {
                $peer.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch($this.errorHandler);
            }
        },

        gotIceCandidate: function(event, forUserID) {
            //console.warn(event.candidate);
            if(event.candidate != null) {
                window.webSockets.sendTo(JSON.stringify({'event': 'offer', 'ice': event.candidate, 'remoteID': window.clientID, 'forUserID': forUserID})); //, 'uuid': $this.uuid
            }
        },

        createdDescription: function(description, forUserID, $peer) {
            $peer.peerConnection.setLocalDescription(description).then(function() {
                window.webSockets.sendTo(JSON.stringify({'event': 'offer', 'sdp': $peer.peerConnection.localDescription, 'remoteID': window.clientID, 'forUserID': forUserID})); //, 'uuid': $this.uuid
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
            var isConnected = false;
            for (i = 0; i < $this.peerConnections.length; i++) {
                if($this.peerConnections[i].remoteID === userID){
                    isConnected = true; break;
                }
            }
            return isConnected;
        },

        updatePeerOptions: function(options){
            for (i = 0; i < $this.peerConnections.length; i++) {
                if($this.peerConnections[i].remoteID === options.remoteID){
                    if(options.order === 'send') { $this.peerConnections[i].options.send.data = true; }
                    else { $this.peerConnections[i].options.receive.data = true; }
                    break;
                }
            }
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
                send : { video: false, audio: false, data: false },
                receive: { video: false, audio: false, data: false }
            }

            var userExist = false;
            for (i = 0; i < $this.users.length; i++) {
                if($this.users[i].remoteID === data.remoteID){
                    $this.users[i].options = initOptions;
                    userExist = true;
                    break;
                }
            }

            if(!userExist){
                $this.users.push({
                    remoteID: data.remoteID,
                    options: initOptions
                });
            }


        },
        removeUserInfo: function(remoteID){
            for (i = 0; i < $this.users.length; i++) {
                if($this.users[i].remoteID === remoteID){
                    $this.users.splice(i, 1);
                }
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
        onStatus: function(status){
            if(status.type === 'stream'){
                $this.sortStream2user({ 'type': 'id', 'streamID': status.streamID, 'remoteID': status.remoteID });
            } else {
                if($this.on.status){ $this.on.status.emit(status); }
            }
        },
        addUserInfo: function(data){
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
                    window.webSockets.sendTo(JSON.stringify(sendMsg));
                } else if(data.status === 'disconnected'){
                    $this.removeUserInfo(data.remoteID);
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
