PeersRTC = function(rtcOptions){

    this.WebRTC = {

        uuid: null,
        peerConnection: null,
        dataConstraint: null,
        receiveChannel: null,
        sendChannel: null,

        localStream: null,
        remoteStream: null,

        init: function(){
            $this.uuid = $this.createUUID();

            if(rtcOptions != null){
                $this.options = rtcOptions;
            }
        },

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
                $this.on.message.emit(event.data);
            }
        },

        // ---- DataChannel CallBack ---- /
        receiveChannelCallback: function(event){
            trace('Receive Channel Callback');
            $this.receiveChannel = event.channel;
            $this.receiveChannel.onmessage = $this.onReceiveMessageCallback;
            $this.receiveChannel.onopen = $this.onReceiveChannelStateChange;
            $this.receiveChannel.onclose = $this.onReceiveChannelStateChange;
        },

        // ---- Opening Connection ---- /
        openConnection: function(isCaller){

            $this.peerConnection = new RTCPeerConnection($this.peerConnectionConfig);
            $this.peerConnection.onicecandidate = $this.gotIceCandidate;
            $this.peerConnection.onaddstream = $this.gotRemoteStream;

            if($this.options.video === true){
                if($this.localStream != null){
                    $this.peerConnection.addStream($this.localStream);
                }
            }

            if($this.options.datachannel === true){
                $this.sendChannel = $this.peerConnection.createDataChannel('sendDataChannel', $this.dataConstraint);
                $this.sendChannel.onopen = $this.onSendChannelStateChange;
                $this.sendChannel.onclose = $this.onSendChannelStateChange;
                $this.peerConnection.ondatachannel = $this.receiveChannelCallback;
            }

            if(isCaller == null) {
                $this.peerConnection.createOffer().then($this.createdDescription).catch($this.errorHandler);
            } else {
                window.webSockets.send(JSON.stringify({'event': 'stream', 'state': 'open', 'uuid': $this.uuid}));
            }

        },

        // ---- On Send DataChannel State Changed ---- /
        onSendChannelStateChange: function(){
            var readyState = $this.sendChannel.readyState;
            var sendDetails = { 'event': 'datachannel', 'type': 'send', 'state': readyState };
            if($this.on.status){
                $this.on.status.emit(sendDetails);
            }

        },

        // ---- On Receive DataChannel State Changed ---- /
        onReceiveChannelStateChange: function(){
            var readyState = $this.receiveChannel.readyState;
            var sendDetails = { 'event': 'datachannel', 'type': 'recieve', 'state': readyState };
            if($this.on.status){
                $this.on.status.emit(sendDetails);
            }

        },

        // ---- Closing Connection ---- /
        closeConnection: function(){
            if($this.peerConnection != null){

                if($this.sendChannel){
                    trace('Closing data channels');
                    $this.sendChannel.close();
                    trace('Closed data channel with label: ' + $this.sendChannel.label);
                    $this.receiveChannel.close();
                    trace('Closed data channel with label: ' + $this.receiveChannel.label);
                }

                $this.peerConnection.close();
                $this.peerConnection = null;
                trace('Closed peer connections');

                window.webSockets.send(JSON.stringify({'event': 'stream', 'state': 'close', 'uuid': $this.uuid}));

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
                var sendDetails = {'event': 'error', 'type': 'local', 'error': msg };
                $this.on.error.emit(sendDetails);
            }
            window.webSockets.send(JSON.stringify({'event': 'error', 'type': 'remote', 'error': msg, 'uuid': $this.uuid}));
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
                        var streamDetails = {'event': 'local', 'stream': stream};
                        $this.on.stream.emit(streamDetails);
                    }
                }).catch($this.errorHandler);

            } else {
                errorHandler('Your browser does not support getUserMedia API');
            }
        },

        gotRemoteStream: function(event){
            if($this.on.stream){
                var streamDetails = {'event': 'remote', 'stream': event.stream};
                $this.on.stream.emit(streamDetails);
            }
        }

    }; $this = this.WebRTC;

    window.PeersRTC = {
        processOffer: function(signal){
            $this.processOffer(signal);
        },
        onStatus: function(status){
            if($this.on.status){
                $this.on.status.emit(status);
            }
        },
        onError: function(error){
            if($this.on.error){
                $this.on.error.emit(error);
            }
        }
    }

    $this.init();

    return $this;
};
