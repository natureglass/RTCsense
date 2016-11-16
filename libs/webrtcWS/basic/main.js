var peers;

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');

var connectToAll = document.querySelector('button#connectToAll');
var showUsers = document.querySelector('button#showUsers');
var sendButton = document.querySelector('button#sendButton');
var closeButton = document.querySelector('button#closeButton');


// ----------------------------------------------------------------------------------------- //

// querySelector, jQuery style
var $ = function (selector) {
  return document.querySelector(selector);
};

// -------------------------------------- UI ACTIONS --------------------------------------- //

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        dataChannelSend.placeholder = '';
        dataChannelSend.disabled = false;
        dataChannelSend.focus();
        //startButton.disabled = true;
        sendButton.disabled = false;
        closeButton.disabled = false;
    },

    // --- On Close Connection --- //
    closeConnection: function(){
        dataChannelSend.value = '';
        dataChannelReceive.value = '';
        dataChannelSend.disabled = true;
        //startButton.disabled = false;
        sendButton.disabled = true;
        closeButton.disabled = true;
        peers.closeConnection();
    },

    // --- On WebRTC Message --- //
    onMessage: function(data){
        dataChannelReceive.value = data.msg;
        console.info('MSG from RemoteID: ' + data.remoteID);
    }

};

// --------------------------------------- UI CLICKS --------------------------------------- //

//     //var options = { video: false, audio: false, datachannel: true }
//     //peers.connect(options);

// --- Get WS Users --- //
connectToAll.onclick = function(){
    for (i = 0; i < $this.users.length; i++) {
        peers.connect(peers.users[i].remoteID);
    }

    window.UI.openConnection();
}

// --- Show Users Array --- //
showUsers.onclick = function(){
  console.log(peers.users);
  console.log(peers.streams);
  console.log(peers.peerConnections);
}

// --- Close Connection --- //
closeButton.onclick = function(){
    //peers.closeConnection();
    window.UI.closeConnection();
}

// --- Send Message --- //
sendButton.onclick = function(){
    var msg = dataChannelSend.value;
    var sendData = msg.replace(/"/g, "'")
    peers.sendData(sendData);
}

// --------------------------------------- WEBRTC ------------------------------------ //

document.addEventListener('DOMContentLoaded', function(){

    peers = new PeersRTC();

// ------------------------------------ DATA CHANNELS -------------------------------------- //

    peers.on('message', function(msg){
        window.UI.onMessage(msg);
    });

// ------------------------------------- COMMON CALLS -------------------------------------  //

    peers.on('status', function(status){

        if(status.type === 'datachannel'){
            if (status.state === 'open') {
                window.UI.openConnection();

                document.getElementById("user_" + status.remoteID).innerHTML += " -> " + status.order;

            } else if (status.state === 'closed') {

                console.warn(status);

                // Close Connection?
                //window.UI.closeConnection();
            }
        }

        console.info('Channel state is: ' + status.state + " / Order: " + status.order);
    });

    peers.on('system', function(system){
        if(system.type === 'local' & system.status === 'connected'){

            document.getElementById("myClientID").innerHTML = system.localID;

            //startButton.disabled = false;

            console.info("LOCAL user / LocalID: " + system.localID + " / " + system.status);

        } else if(system.type === 'remote'){

            if(peers.peerConnection != null){
              // Close Connection?
              //window.UI.closeConnection();
            }

            if(system.status === "connected") {

                document.getElementById("connectedUsersLog").innerHTML += "<li class='connectToUser' userID='" + system.remoteID + "' id='user_" + system.remoteID + "'>" + system.remoteID + "</li>";

                // This is a nice trick for Dynamic Element Binding!
                var links = $('#connectedUsersLog').getElementsByTagName('li');
          			for (var i = 0; i < links.length; i++) {
          				var link = links[i]; link.onclick = onUserClick;
          			}

            } else {
                document.getElementById("user_" + system.remoteID).remove();
            }

            console.info("REMOTE user / RemoteID: " + system.remoteID + " / " + system.status);
        }

    });

    peers.on('error', function(report){
        if(report.type === 'local'){
            console.warn("LOCAL Error / LocalID: " + report.localID + " / " + report.error);
        } else {
            console.warn("REMOTE Error / RemoteID: " + report.remoteID + " / " + report.error);
        }
    });

// ----------------------------------------------------------------------------------------- //
  function onUserClick(){
      var userID = parseInt(this.getAttribute('userID'));

      console.info("Connecting to: " + userID);

      var options = {
          data: { send: true, receive : true },
          video: { send: false, receive : false },
          audio: { send: false, receive : false },
      }

      peers.connect(userID, options);
  }

});
