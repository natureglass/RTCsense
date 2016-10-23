window.WebRTC = {

    uuid: null,
    peerConnection: null,
    dataConstraint: null,
    receiveChannel: null,
    sendChannel: null,

    init: function(){
        window.WebRTC.uuid = window.WebRTC.createUUID();
    },

    peerConnectionConfig : {
        'iceServers': [
            {'urls': 'stun:stun.services.mozilla.com'},
            {'urls': 'stun:stun.l.google.com:19302'},
        ]
    },

    // ---- Sending Message ---- /
    sendData: function(msg){
        trace('Sent Data: ' + msg);
        window.WebRTC.sendChannel.send(msg);
    },

    // ---- Recieving Message ---- /
    onReceiveMessageCallback: function(event){
        trace('Received Message');
        if(typeof window.WebRTC.onMessage === "function"){
            window.WebRTC.onMessage(event.data);
        }
    },

    // ---- DataChannel CallBack ---- /
    receiveChannelCallback: function(event){
        trace('Receive Channel Callback');
        window.WebRTC.receiveChannel = event.channel;
        window.WebRTC.receiveChannel.onmessage = window.WebRTC.onReceiveMessageCallback;
        window.WebRTC.receiveChannel.onopen = window.WebRTC.onReceiveChannelStateChange;
        window.WebRTC.receiveChannel.onclose = window.WebRTC.onReceiveChannelStateChange;
    },

    // ---- Opening Connection ---- /
    openConnection: function(isCaller){

        dataChannelSend.placeholder = '';

        window.WebRTC.peerConnection = new RTCPeerConnection(window.WebRTC.peerConnectionConfig);
        window.WebRTC.peerConnection.onicecandidate = window.WebRTC.gotIceCandidate;

        window.WebRTC.sendChannel = window.WebRTC.peerConnection.createDataChannel('sendDataChannel', window.WebRTC.dataConstraint);
        window.WebRTC.sendChannel.onopen = window.WebRTC.onSendChannelStateChange;
        window.WebRTC.sendChannel.onclose = window.WebRTC.onSendChannelStateChange;

        window.WebRTC.peerConnection.ondatachannel = window.WebRTC.receiveChannelCallback; // receiveChannelCallback;

        if(isCaller) {
            window.WebRTC.peerConnection.createOffer().then(window.WebRTC.createdDescription).catch(window.WebRTC.errorHandler);
        } else {
            console.warn("isCaller: " + isCaller);
        }

    },

    // ---- On Send DataChannel State Changed ---- /
    onSendChannelStateChange: function(){
        var readyState = window.WebRTC.sendChannel.readyState;
        if(typeof window.WebRTC.onDataChannelState === "function"){
            window.WebRTC.onDataChannelState({ 'type': 'send', 'state': readyState });
        }
    },

    // ---- On Receive DataChannel State Changed ---- /
    onReceiveChannelStateChange: function(){
        var readyState = window.WebRTC.receiveChannel.readyState;
        if(typeof window.WebRTC.onDataChannelState === "function"){
            window.WebRTC.onDataChannelState({ 'type': 'recieve', 'state': readyState });
        }
    },

    // ---- Closing Connection ---- /
    closeConnection: function(){
        if(window.WebRTC.peerConnection != null){
            trace('Closing data channels');
            window.WebRTC.sendChannel.close();
            trace('Closed data channel with label: ' + window.WebRTC.sendChannel.label);
            window.WebRTC.receiveChannel.close();
            trace('Closed data channel with label: ' + window.WebRTC.receiveChannel.label);
            window.WebRTC.peerConnection.close();
            window.WebRTC.peerConnection = null;
            trace('Closed peer connections');
        }
    },

    // --------------------- Processing SDP offer Respone ------------------------- //

    processOffer: function(signal){

        // console.info(signal);
        // console.log(window.WebRTC.peerConnection);

        if(!window.WebRTC.peerConnection){
            window.WebRTC.openConnection(false);
        } else {
            console.warn("peerConnection is: " + window.WebRTC.peerConnection);
        }

        // Ignore messages from ourself
        if(signal.uuid == window.WebRTC.uuid) return;

        if(signal.sdp) {
            window.WebRTC.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
                // Only create answers in response to offers
                if(signal.sdp.type == 'offer') {
                    window.WebRTC.peerConnection.createAnswer().then(window.WebRTC.createdDescription).catch(window.WebRTC.errorHandler);
                }
            }).catch(window.WebRTC.errorHandler);
        } else if(signal.ice) {
            window.WebRTC.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(window.WebRTC.errorHandler);
        }
    },

    gotIceCandidate: function(event) {
        if(event.candidate != null) {
            window.webSockets.send(JSON.stringify({'type': 'offer', 'ice': event.candidate, 'uuid': window.WebRTC.uuid}));
        }
    },

    createdDescription: function(description) {
        window.WebRTC.peerConnection.setLocalDescription(description).then(function() {
            window.webSockets.send(JSON.stringify({'type': 'offer', 'sdp': window.WebRTC.peerConnection.localDescription, 'uuid': window.WebRTC.uuid}));
        }).catch(window.WebRTC.errorHandler);
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

};

window.WebRTC.init();