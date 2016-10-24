var peer;

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');

var startVideoButton = document.querySelector('button#startVideoButton');
var connectButton = document.querySelector('button#connectButton');
var closeButton = document.querySelector('button#closeButton');

// ---------------------------- UI --------------------------------- //

window.UI = {

    // --- DOM & WebSockets Ready --- //
    onLoad: function(){
        trace('WebSockets Ready!');
    },

    onUnload: function(){
        trace('Unloaded!');
        if(peer.peerConnection != null){
            peer.closeConnection();
        }
    },

    onOffer: function(data){
        peer.processOffer(data);
    },

    onMessage: function(msg){
        //dataChannelReceive.value = msg;
    },

    onStatus: function(status){
        if(status.type === 'stream'){
            if(status.event === 'close'){
                peer.closeConnection();
                closeButton.disabled = true;
                connectButton.disabled = false;
            }
            console.warn('Remote Stream Status: ' + status.event);
            console.log('uuid: ' + status.uuid);
        }
    },

    openConnection: function(){
        connectButton.disabled = true;
    },

    closeConnection: function(){
        closeButton.disabled = true;
        connectButton.disabled = false;
    },

    onLocalStream: function(event){
        connectButton.disabled = false;
        localVideo.src = window.URL.createObjectURL(event.stream);
    },

    onRemoteStream: function(event){
        closeButton.disabled = false;
        connectButton.disabled = true;
        remoteVideo.src = window.URL.createObjectURL(event.stream);
    }

};

// ------------------------ UI Actions ----------------------------- //

// --- Open Connection --- //
connectButton.onclick = function(){
    closeButton.disabled = false;
    peer.openConnection();
    window.UI.openConnection();
}

// --- Close Connection --- //
closeButton.onclick = function(){
    peer.closeConnection();
    window.UI.closeConnection();
}

// --- Starting WebCam --- //
startVideoButton.onclick = function(){
    startVideoButton.disabled = true;
    peer.startUserMedia({ video: true, audio: true });
}

// --------------------- WebRTC CallBacks -------------------------- //

document.addEventListener('DOMContentLoaded', function(){

    var options = {
         video: true,
         audio: true,
         datachannel: false
    }

    peer = new PeersRTC(options);

// ------------------------- STREAMS ------------------------------- //

    peer.on('stream', function(data){
        if(data.event === "local"){ // Local Video Received
            if(localVideo){
                window.UI.onLocalStream(data);
            }
        } else { // Remote Video Received
            if(remoteVideo){
                window.UI.onRemoteStream(data);
            }
        }
    });

// ---------------------- DATA CHANNELS ---------------------------- //

    peer.on('message', function(msg){
        window.UI.onMessage(msg);
    });

    peer.on('datachannel', function(data){
        if(data.type === 'send'){
            if (data.state === 'open') {
                window.UI.openConnection();
            } else {
                window.UI.closeConnection();
                peer.closeConnection();
            }
        }
        trace(data.state + ' channel state is: ' + data.state);
    });

// ----------------------------------------------------------------- //

});
