<!DOCTYPE html>

<html>
<head>

  <meta charset="utf-8">
  <meta name="description" content="WebRTC code samples">
  <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1">
  <meta itemprop="description" content="Client-side WebRTC code samples">
  <meta itemprop="name" content="WebRTC code samples">
  <meta name="mobile-web-app-capable" content="yes">
  <meta id="theme-color" name="theme-color" content="#ffffff">

  <base target="_blank">

  <title>Transmit text</title>

  <link rel="stylesheet" href="libs/webrtc/content/datachannel/basic/css/main.css" />

  <script type="text/javascript">
    window.userID = 1;
    window.username = "natureglass";
  </script>

</head>

<body>

  <div id="container">

    <div id="buttons">
      <button id="startButton">Start</button>
      <button id="sendButton" disabled>Send</button>
      <button id="closeButton" disabled>Stop</button>
    </div>

    <div id="sendReceive">
      <div id="send">
        <h2>Send</h2>
        <textarea id="dataChannelSend" disabled placeholder="Press Start, enter some text, then press Send."></textarea>
      </div>
      <div id="receive">
        <h2>Receive</h2>
        <textarea id="dataChannelReceive" disabled></textarea>
      </div>
    </div>

    <p>View the console to see logging.</p>

    <p>The <code>RTCPeerConnection</code> objects <code>localConnection</code> and <code>remoteConnection</code> are in global scope, so you can inspect them in the console as well.</p>

    <p>For more information about RTCDataChannel, see <a href="http://www.html5rocks.com/en/tutorials/webrtc/basics/#toc-rtcdatachannel" title="RTCDataChannel section of HTML5 Rocks article about WebRTC">Getting Started With WebRTC</a>.</p>

    <a href="https://github.com/webrtc/samples/tree/gh-pages/src/content/datachannel/basic" title="View source for this page on GitHub" id="viewSource">View source on GitHub</a>
  </div>

  <script src="assets/js/cfwebsockets.js"></script>

  <script src="libs/webrtc/js/adapter.js"></script>
  <script src="libs/webrtc/js/common.js"></script>
  <script src="libs/webRTC_basic/main.js"></script>

  <script type="text/javascript">
    function receiveMessage(objData){
        console.log("ReceiveMessage:");
        console.log(objData.data);
    }
    function cfWSupdates(status, wsUserID){
        console.log(status + " - " + wsUserID);
    }
  </script>
  
</body>
</html>
