var peer;

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

// ------------------------ UI Actions ----------------------------- //

window.UI = {

    // --- DOM & WebSockets Ready --- //
    onLoad: function(){
        trace('WebSockets Ready!');
        startButton.disabled = false;
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
        dataChannelReceive.value = msg;
    },

    // --- Status --- //
    onStatus: function(status){
        if(status.type === 'stream'){
            console.log('Stream Status: ' + status.event);
        } else {
            console.log('DataChannel Status');
            console.log(status);
        }
    },

    // --- On Open Connection --- //
    openConnection: function(){
        dataChannelSend.placeholder = '';
        dataChannelSend.disabled = false;
        dataChannelSend.focus();
        startButton.disabled = true;
        sendButton.disabled = false;
        closeButton.disabled = false;
    },

    // --- On Close Connection --- //
    closeConnection: function(){
        dataChannelSend.value = '';
        dataChannelReceive.value = '';
        dataChannelSend.disabled = true;
        startButton.disabled = false;
        sendButton.disabled = true;
        closeButton.disabled = true;
    }

};

// ------------------------ UI Actions ----------------------------- //

// --- Open Connection --- //
startButton.onclick = function(){
    peer.openConnection();
    window.UI.openConnection();
}

// --- Close Connection --- //
closeButton.onclick = function(){
    peer.closeConnection();
    window.UI.closeConnection();
}

// --- Send Message --- //
sendButton.onclick = function(){
    peer.sendData(dataChannelSend.value);
}

// --------------------- WebRTC CallBacks -------------------------- //

document.addEventListener('DOMContentLoaded', function(){

    var options = {
         video: false,
         audio: false,
         datachannel: true
    }

    peer = new PeersRTC(options);

// ------------------------- STREAMS ------------------------------- //

    peer.on('stream', function(data){
        if(data.event === "local"){ // Local Video Received
            if(localVideo){
                localVideo.src = window.URL.createObjectURL(data.stream);
            }
        } else { // Remote Video Received
            if(remoteVideo){
                remoteVideo.src = window.URL.createObjectURL(data.stream);
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
