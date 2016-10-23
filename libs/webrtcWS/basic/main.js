
var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

startButton.disabled = true;

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        startButton.disabled = true;
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

    // --- On WebSockets Events --- //
    onWebSocketsEvent: function(data){
        console.log(data.event + " - " + data.status + " - " + data.localID);
        if(data.event === "local" & data.status === "connected"){
            trace('WebSockets Ready!');
            startButton.disabled = false;
        } else if(data.event === "remote" & data.status === "disconnected"){
            if(window.WebRTC.peerConnection != null){
                window.WebRTC.closeConnection();
            }
        }
    },

    // --- On WebSockets Message --- //
    onWebSocketsMsg: function(data){
        var response = JSON.parse(data.msg);

        switch (response.type) {
            case 'offer': // Remote User Gave us an Offer
                window.WebRTC.processOffer(response);
                break;

            case 'close': // Remote User HangUp
                window.WebRTC.closeConnection();
                break;

            default:
                console.warn('WHAT WAS THAT?');
                console.info(response);
        }
    }
};

// ------------------------ WebRTC CallBacks ----------------------------- //

window.WebRTC.dataChannelOpen = function(){
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    sendButton.disabled = false;
    closeButton.disabled = false;
};

window.WebRTC.dataChannelClosed = function(){
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
};

window.WebRTC.onMessage = function(msg){
    dataChannelReceive.value = msg;
}

// ------------------------ UI Actions ----------------------------- //

// --- Open Connection --- //
startButton.onclick = function(){
    window.WebRTC.openConnection(true);
    window.UI.openConnection();
}

// --- Close Connection --- //
closeButton.onclick = function(){
    window.WebRTC.closeConnection();
    window.UI.closeConnection();
}

// --- Send Message --- //
sendButton.onclick = function(){
    window.WebRTC.sendData(dataChannelSend.value);
}
