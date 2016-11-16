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
  <meta itemprop="image" content="../../../images/webrtc-icon-192x192.png">
  <meta itemprop="name" content="WebRTC code samples">
  <meta name="mobile-web-app-capable" content="yes">
  <meta id="theme-color" name="theme-color" content="#ffffff">

  <base target="_blank">

  <title>Transmit text</title>

  <link rel="icon" sizes="192x192" href="libs/webrtc/images/webrtc-icon-192x192.png">
  <link href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="libs/webrtc/css/main.css">
  <link rel="stylesheet" href="libs/webrtcWS/basic/main.css" />

  <script type="text/javascript">
      var randNum = Math.floor(Math.random() * 600) + 1;
      window.userID  = "1";
      window.username  = "user_" + randNum;
  </script>

</head>

<body>

  <div id="container">

    <h1><a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a> <span>Transmit text</span></h1>

    <div id="buttons">
      <button id="usersButton">Start ALL</button>
      <button id="startButton" disabled>Start</button>
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

  <script src="sensePlayer/js/cfwebsockets.js"></script>
  <script src="libs/webrtc/js/adapter.js"></script>
  <script src="libs/webrtc/js/common.js"></script>

  <script src="sensePlayer/js/cfwebrtc.js"></script>
  <script src="libs/webrtcWS/basic/main.js"></script>


</body>
</html>
