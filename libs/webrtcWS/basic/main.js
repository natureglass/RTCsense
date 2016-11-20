var peers;

var dataChannelSend = document.querySelector('textarea#dataChannelSend');
var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');

var connectToAll = document.querySelector('button#connectToAll');
var disconnectAll = document.querySelector('button#disconnectAll');
var showUsers = document.querySelector('button#showUsers');
var sendButton = document.querySelector('button#sendButton');

// -------------------------------------- UI ACTIONS --------------------------------------- //

window.UI = {

    // --- On Open Connection --- //
    openConnection: function(){
        dataChannelSend.placeholder = '';
        dataChannelSend.disabled = false;
        dataChannelSend.focus();
        sendButton.disabled = false;
    },

    // --- On Close Connection --- //
    closeConnection: function(){
        dataChannelSend.placeholder = '';
        dataChannelSend.disabled = true;
        dataChannelSend.focus();
        sendButton.disabled = true;
    },

    disconnectPeer: function(remoteID){
        peers.disconnect(remoteID);
    },

    // --- On WebRTC Message --- //
    onMessage: function(data){
        dataChannelReceive.value = data.msg;
    }

};

// --------------------------------------- UI CLICKS --------------------------------------- //

//     //var options = { video: false, audio: false, datachannel: true }
//     //peers.connect(options);

// --- Get WS Users --- //
connectToAll.onclick = function(){

    var options = { // DataChannel Send/Recieve is always True by Default
        video: { send: false, receive : false },
        audio: { send: false, receive : false }
    }

    for (i = 0; i < $this.users.length; i++) {
        peers.connect(peers.users[i].clientID, options);
    }

    window.UI.openConnection();
}


disconnectAll.onclick = function(){
    console.log("Disconnecting All!");
    peers.disconnect();

}

// --- Show Users Array --- //
showUsers.onclick = function(){
    console.info(peers.users);
    console.info(peers.peerConnections);
}

// --- Send Message --- //
sendButton.onclick = function(){
    var msg = dataChannelSend.value;
    var sendData = msg.replace(/"/g, "'")
    peers.sendData(sendData);
}

// --------------------------------------- PEERS WEBRTC ------------------------------------ //

document.addEventListener('DOMContentLoaded', function(){

    peers = new PeersRTC();

    // Incoming Connections
    peers.on('connection', function(conn){

        // On Peer Status
        if(conn.type === 'peer'){

            // Connections is Stable
            if(conn.state === 'stable'){

                var thisElem = document.getElementById("user_" + conn.remoteID);
                if(thisElem){ thisElem.innerHTML = conn.remoteID +  " -> " + conn.type; }

                window.UI.openConnection();

            // Connections is Closed
            } else if(conn.state === 'closed'){

                var thisElem = document.getElementById("user_" + conn.remoteID);
                if(thisElem){ thisElem.innerHTML += " -> " + conn.state; }

                if(!peers.peerConnections.length){ window.UI.closeConnection(); }

            // Renegotiating Connection
            } else if(conn.state === 'renegotiate'){

                var thisElem = document.getElementById("user_" + conn.remoteID);
                if(thisElem){ thisElem.innerHTML += " -> " + conn.state; }

                window.UI.openConnection();

            }

        }

        // On DataChannel Status
        if(conn.type === 'datachannel'){

            // Send/Recieve Connection
            if(conn.state === 'open'){
                var thisElem = document.getElementById("user_" + conn.remoteID);
                if(thisElem){ thisElem.innerHTML += " -> " + conn.order; }
            }

        }

        console.info(conn.type + ' state is: ' + conn.state + " / Order: " + conn.order);

    });

    peers.on('error', function(report){
        if(report.type === 'local'){
            console.error("LOCAL Error / LocalID: " + report.localID + " / " + report.error);
        } else {
            console.error("REMOTE Error / RemoteID: " + report.remoteID + " / " + report.error);
        }
        //alert(report.error);
    });

    // Incoming Messages
    peers.on('message', function(msg){
        window.UI.onMessage(msg);
    });

// ------------------------------------- SYSTEM STATUS -------------------------------------  //

    peers.on('system', function(system){

        if(system.type === 'local' & system.status === 'connected'){

            document.getElementById("myClientID").innerHTML = system.localID;
            connectToAll.disabled = false;
            console.info("LOCAL user / LocalID: " + system.localID + " / " + system.status);

        } else if(system.type === 'remote'){

            if(system.status === "connected") {

                document.getElementById("connectedUsersLog").innerHTML += "<li class='connectToUser' userID='" + system.remoteID + "' id='user_" + system.remoteID + "'> " + system.remoteID + "</li><a href='javascript:void(0)' onclick='window.UI.disconnectPeer(" + system.remoteID + "); return false;'>X</a>";

                // This is a nice trick for Dynamic Element Binding!
                var links = document.querySelector('#connectedUsersLog').getElementsByTagName('li');
      			for (var i = 0; i < links.length; i++) {
      				var link = links[i]; link.onclick = onUserClick;
      			}

            } else if(system.status === "disconnected") {
                var userElem = document.getElementById("user_" + system.remoteID);
                if(userElem){
                    var nextElem = userElem.nextSibling;
                    nextElem.remove(); userElem.remove();
                }
            }

            console.info("REMOTE user / RemoteID: " + system.remoteID + " / " + system.status);

        }

    });

// ----------------------------------------------------------------------------------------- //
  function onUserClick(){

      var userID = parseInt(this.getAttribute('userID'));

      var options = { // DataChannel Send/Recieve is always True by Default
          video: { send: false, receive : false },
          audio: { send: false, receive : false }
      }

      peers.connect(userID, options);
  }

});
