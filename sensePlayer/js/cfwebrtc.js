PeersRTC = function(rtcOptions){

    this.WebRTC = {

        uuid: null,
        peerConnection: null,
        dataConstraint: null,
        receiveChannel: null,
        sendChannel: null,

        localStream: null,
        remoteStream: null,

        users: [{}],
        streams: [{}],

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
            $this.sendChannel.send(msg);
        },

        // ---- Recieving Message ---- /
        onReceiveMessageCallback: function(event){
            trace('Received Message');
            if($this.on.message){
                $this.on.message.emit({msg: event.data, remoteID: event.target.label});
            }
        },

        // ---- DataChannel CallBack ---- /
        receiveChannelCallback: function(event){
            trace('Receive Channel Callback');
            $this.receiveChannel = event.channel;
            $this.receiveChannel.onmessage = $this.onReceiveMessageCallback;
            $this.receiveChannel.onopen = $this.onReceiveChannelStateChange;
            $this.receiveChannel.onclose = $this.onReceiveChannelStateChange;
            $this.onReceiveChannelStateChange();
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

        connect: function(rtcOptions){
            $this.uuid = $this.createUUID();

            if(rtcOptions != null){ $this.options = rtcOptions; }
            $this.openConnection();
        },

        // ---- Opening Connection ---- /
        openConnection: function(isCaller){

            $this.peerConnection = new RTCPeerConnection($this.peerConnectionConfig);
            $this.peerConnection.onicecandidate = $this.gotIceCandidate;
            $this.peerConnection.onaddstream = $this.gotRemoteStream;

            if($this.options.video === true){
                if($this.localStream != null){
                    $this.peerConnection.addStream($this.localStream);
                    var localStreamID = $this.localStream.id;
                    window.webSockets.send(JSON.stringify({'event': 'status', 'type': 'stream', 'state': 'open', 'remoteID': window.clientID, 'streamID': localStreamID }));
                }
            }

            if($this.options.datachannel === true){
                $this.sendChannel = $this.peerConnection.createDataChannel(window.clientID, $this.dataConstraint);
                $this.sendChannel.onopen = $this.onSendChannelStateChange();
                $this.sendChannel.onclose = $this.onSendChannelStateChange();
                $this.peerConnection.ondatachannel = $this.receiveChannelCallback;
                window.webSockets.send(JSON.stringify({'event': 'status', 'type': 'datachannel', 'order': 'send', 'state': 'open', 'remoteID': window.clientID }));
            }

            if(isCaller == null) {
                $this.peerConnection.createOffer().then($this.createdDescription).catch($this.errorHandler);
            } else {
                //window.webSockets.send(JSON.stringify({'event': 'stream', 'type': 'state', 'state': 'open', 'uuid': $this.uuid}));
            }

        },

        // ---- On Send DataChannel State Changed ---- /
        onSendChannelStateChange: function(){
            var readyState = $this.sendChannel.readyState;
            var sendDetails = { 'event': 'status', 'type': 'datachannel', 'order': 'send', 'state': readyState };
            if($this.on.status){
                $this.on.status.emit(sendDetails);
            }

        },

        // ---- On Receive DataChannel State Changed ---- /
        onReceiveChannelStateChange: function(){
            var readyState = $this.receiveChannel.readyState;
            var sendDetails = { 'event': 'status', 'type': 'datachannel', 'order': 'recieve', 'state': readyState };
            if($this.on.status){
                $this.on.status.emit(sendDetails);
            }
        },

        // ---- Closing Connection ---- /
        closeConnection: function(){
            if($this.peerConnection != null){

                if($this.sendChannel){
                    trace('Closing data channels');
                    if($this.sendChannel != null) { $this.sendChannel.close(); }
                    trace('Closed data channel with label: ' + $this.sendChannel.label);
                    if($this.receiveChannel != null) { $this.receiveChannel.close(); }
                    trace('Closed data channel with label: ' + $this.receiveChannel.label);
                }

                if($this.peerConnection != null) {
                    $this.peerConnection.close();
                    $this.peerConnection = null;
                    trace('Closed peer connections');
                    //window.webSockets.send(JSON.stringify({'event': 'status', 'type': 'stream', 'state': 'close', 'order': 'remote', 'remoteID': window.clientID }));
                }

            }
        },

        // --------------------- Processing SDP offer Respone ------------------------- //

        processOffer: function(signal){

            if(!$this.peerConnection){
                $this.openConnection(false);
            }

            // Ignore messages from ourself
            if(signal.uuid == $this.uuid) return;

            if(signal.sdp) {
                $this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
                    // Only create answers in response to offers
                    if(signal.sdp.type == 'offer') {
                        $this.peerConnection.createAnswer().then($this.createdDescription).catch($this.errorHandler);
                    }
                }).catch($this.errorHandler);
            } else if(signal.ice) {
                $this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch($this.errorHandler);
            }
        },

        gotIceCandidate: function(event) {
            if(event.candidate != null) {
                window.webSockets.send(JSON.stringify({'event': 'offer', 'ice': event.candidate, 'uuid': $this.uuid}));
            }
        },

        createdDescription: function(description) {
            $this.peerConnection.setLocalDescription(description).then(function() {
                window.webSockets.send(JSON.stringify({'event': 'offer', 'sdp': $this.peerConnection.localDescription, 'uuid': $this.uuid}));
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
            console.log(data); // Remote Users Stream Options !!! //
            var userExist = false;
            for (i = 0; i < $this.users.length; i++) {
                if($this.users[i].remoteID === data.remoteID){
                    $this.users[i].options = data.options;
                    userExist = true;
                    break;
                }
            }

            if(!userExist){
                $this.users.push({
                    remoteID: data.remoteID,
                    options: data.options
                });
            }
            //console.log($this.users);

        },
        removeUserInfo: function(remoteID){
            for (i = 0; i < $this.users.length; i++) {
                if($this.users[i].remoteID === remoteID){
                    $this.users.splice(i, 1);
                }
            }
            //console.log($this.users);
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
            $this.addUserInfo(data);
        },
        onSystem: function(data){
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
