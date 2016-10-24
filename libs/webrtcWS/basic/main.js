var rtcPeerConnection;

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        startButton.disabled = true;
        dataChannelSend.placeholder = '';
    },

    // --- On Close Connection --- //
    closeConnection: function(){

        dataChannelSend.value = '';
        dataChannelReceive.value = '';
        dataChannelSend.disabled = true;

        sendButton.disabled = true;
        closeButton.disabled = true;
    },

    // --- On WebSockets Events --- //
    onWebSocketsEvent: function(data){
        console.log(data.event + " - " + data.status + " - " + data.localID);
        if(data.event === "local" & data.status === "connected"){
            trace('WebSockets Ready!');
            startButton.disabled = false;
        } else if(data.event === "remote" & data.status === "disconnected"){
            if(rtcPeerConnection.peerConnection != null){
                rtcPeerConnection.closeConnection();
            }
        }
    },

    // --- On WebSockets Message --- //
    onWebSocketsMsg: function(data){
        var response = JSON.parse(data.msg);

        switch (response.type) {
            case 'offer': // Remote User Gave us an Offer
                rtcPeerConnection.processOffer(response);
                break;

            default:
                console.warn('WHAT WAS THAT?');
                console.info(response);
        }
    }

};

// ------------------------ WebRTC CallBacks ----------------------------- //

document.addEventListener('DOMContentLoaded', function(){

    var options = {
         video: false,
         audio: false,
         datachannel: true
    }

    rtcPeerConnection = new PeersRTC(options);

    // --- on WebSockets Message --- //
    rtcPeerConnection.onMessage = function(msg){
        dataChannelReceive.value = msg;
    }

    // --- on WebSockets DataChannel State --- //
    rtcPeerConnection.onDataChannelState = function(data){
        if(data.type === 'send'){

            if (data.state === 'open') {

                dataChannelSend.disabled = false;
                dataChannelSend.focus();

                window.UI.openConnection();
                sendButton.disabled = false;
                closeButton.disabled = false;

            } else {

                dataChannelSend.disabled = true;
                startButton.disabled = false;

                window.UI.closeConnection();
                rtcPeerConnection.closeConnection();

            }

        }

        trace(data.state + ' channel state is: ' + data.state);

    }

});

// ------------------------ UI Actions ----------------------------- //

// --- Open Connection --- //
startButton.onclick = function(){
    rtcPeerConnection.openConnection();
    window.UI.openConnection();
}

// --- Close Connection --- //
closeButton.onclick = function(){
    rtcPeerConnection.closeConnection();
    window.UI.closeConnection();
}

// --- Send Message --- //
sendButton.onclick = function(){
    rtcPeerConnection.sendData(dataChannelSend.value);
}
