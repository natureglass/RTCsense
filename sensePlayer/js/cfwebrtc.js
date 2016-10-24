PeersRTC = function(rtcOptions){

    this.WebRTC = {

        uuid: null,
        peerConnection: null,
        dataConstraint: null,
        receiveChannel: null,
        sendChannel: null,

        localDescription: null,

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
            if(typeof $this.onMessage === "function"){
                $this.onMessage(event.data);
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
        openConnection: function(){

            $this.peerConnection = new RTCPeerConnection($this.peerConnectionConfig);
            $this.peerConnection.onicecandidate = $this.gotIceCandidate;

            if($this.options.datachannel){
                $this.sendChannel = $this.peerConnection.createDataChannel('sendDataChannel', $this.dataConstraint);
                $this.sendChannel.onopen = $this.onSendChannelStateChange;
                $this.sendChannel.onclose = $this.onSendChannelStateChange;
                $this.peerConnection.ondatachannel = $this.receiveChannelCallback;
            }

            if(!$this.localDescription) {
                $this.peerConnection.createOffer().then($this.createdDescription).catch($this.errorHandler);
            }

        },

        // ---- On Send DataChannel State Changed ---- /
        onSendChannelStateChange: function(){
            var readyState = $this.sendChannel.readyState;
            if(typeof $this.onDataChannelState === "function"){
                $this.onDataChannelState({ 'type': 'send', 'state': readyState });
            }
        },

        // ---- On Receive DataChannel State Changed ---- /
        onReceiveChannelStateChange: function(){
            var readyState = $this.receiveChannel.readyState;
            if(typeof $this.onDataChannelState === "function"){
                $this.onDataChannelState({ 'type': 'recieve', 'state': readyState });
            }
        },

        // ---- Closing Connection ---- /
        closeConnection: function(){
            if($this.peerConnection != null){
                $this.localDescription = null;
                trace('Closing data channels');
                $this.sendChannel.close();
                trace('Closed data channel with label: ' + $this.sendChannel.label);
                $this.receiveChannel.close();
                trace('Closed data channel with label: ' + $this.receiveChannel.label);
                $this.peerConnection.close();
                $this.peerConnection = null;
                trace('Closed peer connections');
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
                window.webSockets.send(JSON.stringify({'type': 'offer', 'ice': event.candidate, 'uuid': $this.uuid}));
            }
        },

        createdDescription: function(description) {
            $this.localDescription = description;
            $this.peerConnection.setLocalDescription(description).then(function() {
                window.webSockets.send(JSON.stringify({'type': 'offer', 'sdp': $this.peerConnection.localDescription, 'uuid': $this.uuid}));
            }).catch($this.errorHandler);
        },

        errorHandler: function(error) {
            console.log(error);
        },

        // Taken from http://stackoverflow.com/a/105074/515584
        // Strictly speaking, it's not a real UUID, but it gets the job done here
        createUUID: function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
          }

          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

    }; $this = this.WebRTC;

    $this.init();

    return $this;
};
