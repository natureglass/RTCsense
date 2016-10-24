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

    onMessage: function(msg){
        dataChannelReceive.value = msg;
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

// ---------------------- DATA CHANNELS ---------------------------- //

    peer.on('message', function(msg){
        window.UI.onMessage(msg);
    });

    peer.on('status', function(status){
        if(status.event === 'datachannel'){
            if(status.type === 'send'){
                if (status.state === 'open') {
                    window.UI.openConnection();
                } else {
                    window.UI.closeConnection();
                    peer.closeConnection();
                }
            }
            trace('Channel state is: ' + status.state);
        }
    });

// ----------------------------------------------------------------- //

});
