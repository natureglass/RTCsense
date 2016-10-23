
var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        startButton.disabled = true;
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

            default:
                console.warn('WHAT WAS THAT?');
                console.info(response);
        }
    }

};

// ------------------------ WebRTC CallBacks ----------------------------- //

// --- on WebSockets Message --- //
window.WebRTC.onMessage = function(msg){
    dataChannelReceive.value = msg;
}

// --- on WebSockets DataChannel State --- //
window.WebRTC.onDataChannelState = function(data){
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
            window.WebRTC.closeConnection();

        }
        
    }

    trace(data.state + ' channel state is: ' + data.state);

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
