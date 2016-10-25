var peer;

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

// ------------------------ UI Actions ----------------------------- //

window.UI = {

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
    },

    // --- On WebRTC Message --- //
    onMessage: function(msg){
        dataChannelReceive.value = msg;
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

        } else if(status.event === 'websockets'){

            if(status.type === 'local' & status.status === 'connected'){
                startButton.disabled = false;
                console.warn(status.type + " WebSockets: " + status.status + " with LocalID: " + status.localID);
            } else if(status.type === 'remote'){
                if(peer.peerConnection != null){ peer.closeConnection(); }
                console.warn(status.type + " WebSockets: " + status.status + " with remoteID: " + status.remoteID);
            }

        }
    });

// ----------------------------------------------------------------- //

});
