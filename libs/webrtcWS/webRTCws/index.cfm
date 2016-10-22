<!DOCTYPE html>
<!--
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
-->
<html>
<head>

  <meta charset="utf-8">
  <meta name="description" content="WebRTC code samples">
  <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1">
  <meta itemprop="description" content="Client-side WebRTC code samples">
  <meta itemprop="image" content="libs/webrtc/images/webrtc-icon-192x192.png">
  <meta itemprop="name" content="WebRTC code samples">
  <meta name="mobile-web-app-capable" content="yes">
  <meta id="theme-color" name="theme-color" content="#ffffff">

  <base target="_blank">

  <title>Peer connection</title>

  <link rel="icon" sizes="192x192" href="libs/webrtc/images/webrtc-icon-192x192.png">
  <link href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="libs/webrtc/css/main.css" />
  <link rel="stylesheet" href="libs/webrtcWS/pc1/main.css" />

  <script type="text/javascript">
      var randNum = Math.floor(Math.random() * 600) + 1;
      window.userID  = "1";
      window.username  = "user_" + randNum;
  </script>

</head>

<body>

  <div id="container">

    <div class="highlight">
      <p>New codelab: <a href="https://codelabs.developers.google.com/codelabs/webrtc-web">Realtime communication with WebRTC</a></p>
    </div>

    <h1><a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a> <span>Peer connection</span></h1>

    <video id="localVideo" autoplay muted poster="assets/img/offline.jpg"></video>
    <video id="remoteVideo" autoplay poster="assets/img/offline.jpg"></video>

    <div>
      <button id="startButton">Start Video</button>
      <button id="callButton">Send Video</button>
      <button id="hangupButton">Hang Up</button>
    </div>

    <p>View the console to see logging. The <code>MediaStream</code> object <code>localStream</code>, and the <code>RTCPeerConnection</code> objects <code>pc1</code> and <code>pc2</code> are in global scope, so you can inspect them in the console as well.</p>

    <p>For more information about RTCPeerConnection, see <a href="http://www.html5rocks.com/en/tutorials/webrtc/basics/" title="HTML5 Rocks article about WebRTC by Sam Dutton">Getting Started With WebRTC</a>.</p>


    <a href="https://github.com/webrtc/samples/tree/gh-pages/src/content/peerconnection/pc1" title="View source for this page on GitHub" id="viewSource">View source on GitHub</a>

  </div>

  <script src="sensePlayer/js/cfwebsockets.js"></script>
  <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
  <script src="libs/webrtcWS/webRTCws/main.js"></script>

</body>
</html>
