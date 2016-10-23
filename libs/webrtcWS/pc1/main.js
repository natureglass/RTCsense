
var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');

var startVideoButton = document.querySelector('button#startVideoButton');
var connectButton = document.querySelector('button#connectButton');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        connectButton.disabled = true;
    },

    // --- On Close Connection --- //
    closeConnection: function(){

        //dataChannelSend.value = '';
        //dataChannelReceive.value = '';
        //dataChannelSend.disabled = true;

        sendButton.disabled = true;
        closeButton.disabled = true;
    },

    // --- On WebSockets Events --- //
    onWebSocketsEvent: function(data){
        console.log(data.event + " - " + data.status + " - " + data.localID);
        if(data.event === "local" & data.status === "connected"){
            trace('WebSockets Ready!');
            connectButton.disabled = false;
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
    },

    // --- Create Local Stream Video --- //
    getUserMediaSuccess: function(stream) {
        localStream = stream;
        localVideo.src = window.URL.createObjectURL(stream);
        //callButton.disabled = false;
    },

    // --- Errors Catch --- //
    errorHandler: function(error) {
        console.log(error);
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

            //dataChannelSend.disabled = false;
            //dataChannelSend.focus();

            window.UI.openConnection();
            sendButton.disabled = false;
            closeButton.disabled = false;

        } else {

            //dataChannelSend.disabled = true;
            connectButton.disabled = false;

            window.UI.closeConnection();
            window.WebRTC.closeConnection();

        }

    }

    trace(data.state + ' channel state is: ' + data.state);

}

// ------------------------ UI Actions ----------------------------- //

// --- Open Connection --- //
connectButton.onclick = function(){

    var options = {
        video: true,
        audio: true,
        datachannel: false
    }

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
    //window.WebRTC.sendData(dataChannelSend.value);
}

// --- Starting WebCam --- //
startVideoButton.onclick = function(){

    startVideoButton.disabled = true;

    var constraints = {
        video: true,
        audio: true,
    };

    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(window.UI.getUserMediaSuccess).catch(window.UI.errorHandler);
    } else {
        alert('Your browser does not support getUserMedia API');
    }

}
