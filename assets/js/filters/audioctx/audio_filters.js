AudioFilters = function(audioContext, sourceNode){

	this.effect = null;
	this.audioInput = null;
	this.realAudioInput = null;
	this.effectInput = null;
	this.wetGain = null;
	this.dryGain = null;
	this.outputMix = null;
	this.currentEffectNode = null;
	this.reverbBuffer = null;
	this.dtime = null;
	this.dregen = null;
	this.lfo = null;
	this.cspeed = null;
	this.cdelay = null;
	this.cdepth = null;
	this.scspeed = null;
	this.scldelay = null;
	this.scrdelay = null;
	this.scldepth = null;
	this.scrdepth = null;
	this.fldelay = null;
	this.flspeed = null;
	this.fldepth = null;
	this.flfb = null;
	this.sflldelay = null;
	this.sflrdelay = null;
	this.sflspeed = null;
	this.sflldepth = null;
	this.sflrdepth = null;
	this.sfllfb = null;
	this.sflrfb = null;
	this.rmod = null;
	this.mddelay = null;
	this.mddepth = null;
	this.mdspeed = null;
	this.lplfo = null;
	this.lplfodepth = null;
	this.lplfofilter = null;
	this.awFollower = null;
	this.awDepth = null;
	this.awFilter = null;
	this.ngFollower = null;
	this.ngGate = null;
	this.bitCrusher = null;
	this.btcrBits = 16;   // between 1 and 16
	this.btcrNormFreq = 1; // between 0.0 and 1.0

	var rafID = null;
	var analyser1;
	var analyserView1;
	var analyserView2;

	this.lpInputFilter = null;
	this.lastEffect = -1;
	
	this.useFeedbackReduction = true;

	this.init = function(selectedEffect, analyser){

		// Get an AudioNode from the stream.
		this.audioInput = this.convertToMono( sourceNode );
	    
	    if (this.useFeedbackReduction) {
	    	this.audioInput.connect( this.createLPInputFilter() );
	    	this.audioInput = this.lpInputFilter;	        
	    }
	    
	    // Create mix gain nodes
	    this.outputMix 	 = audioContext.createGain();
	    this.dryGain 	 = audioContext.createGain();
	    this.wetGain 	 = audioContext.createGain();
	    this.effectInput = audioContext.createGain();
	    
	    this.audioInput.connect(this.dryGain);
	    this.audioInput.connect(this.effectInput);

	    this.dryGain.connect(this.outputMix);
	    this.wetGain.connect(this.outputMix);
	    
	    //this.outputMix.connect( audioContext.destination);

	    if(analyser != null){
		    analyser1 = analyser;
		    this.outputMix.connect(analyser1);
	    }
	    
	    if(selectedEffect.length){
	    	this.crossfade(1.0);
	    	this.changeEffect(selectedEffect);
	    }
	    
	}

	this.changeEffect = function(selectedEffect){
		
		this.lfo = null;
		this.dtime = null;
		this.dregen = null;
		this.cspeed = null;
		this.cdelay = null;
		this.cdepth = null;
		this.rmod = null;
		this.fldelay = null;
		this.flspeed = null;
		this.fldepth = null;
		this.flfb = null;
		this.scspeed = null;
		this.scldelay = null;
		this.scrdelay = null;
		this.scldepth = null;
		this.scrdepth = null;
		this.sflldelay = null;
		this.sflrdelay = null;
		this.sflspeed = null;
		this.sflldepth = null;
		this.sflrdepth = null;
		this.sfllfb = null;
		this.sflrfb = null;
		this.mdfeedback = null;
		this.mddelay = null;
		this.mddepth = null;
		this.mdspeed = null;
		this.lplfo = null;
		this.lplfodepth = null;
		this.lplfofilter = null;
		this.awFollower = null;
		this.awDepth = null;
		this.awFilter = null;
		this.ngFollower = null;
		this.ngGate = null;
		this.bitCrusher = null;

	    if (this.currentEffectNode) 
	    	this.currentEffectNode.disconnect();
	    if (this.effectInput)
	    	this.effectInput.disconnect();

	    switch (selectedEffect) {
	        case "Delay": // Delay
	        	this.currentEffectNode = this.createDelay();
	            break;
	        case "Reverb": // Reverb
	        	this.currentEffectNode = this.createReverb();
	            break;
	        case "Distortion": // Distortion
	        	this.currentEffectNode = this.createDistortion();
	            break;
	        case "Telephone": // Telephone
	            this.currentEffectNode = this.createTelephonizer();
	            break;
	        case "GainLFO": // GainLFO
	            this.currentEffectNode = this.createGainLFO();
	            break;
	        case "Chorus": // Chorus
	            this.currentEffectNode = this.createChorus();
	            break;
	        case "Flange": // Flange
	            this.currentEffectNode = this.createFlange();
	            break;
	        case "Ringmod": // Ringmod
	            this.currentEffectNode = this.createRingmod();
	            break;
	        case "StereoChorus": // Stereo Chorus
	            this.currentEffectNode = this.createStereoChorus();
	            break;
	        case "StereoFlange": // Stereo Flange
	            this.currentEffectNode = this.createStereoFlange();
	            break;
	        case "PitchShifting": // Pitch shifting
	            this.currentEffectNode = this.createPitchShifter();
	            break;
	        case "ModDelay": // Mod Delay 
	            this.currentEffectNode = this.createModDelay();
	            break;
	        case "Ping-pong": // Ping-pong delay
	            var pingPong = this.createPingPongDelay(audioContext, (this.audioInput == this.realAudioInput), 0.3, 0.4 );
	            pingPong.output.connect( this.wetGain );
	            this.currentEffectNode = pingPong.input;
	            break;
	        case "LPF-LFO": // LPF LFO
	            this.currentEffectNode = this.createFilterLFO();
	            break;
	        case "EnvelopeFollower": // Envelope Follower
	            this.currentEffectNode = this.createEnvelopeFollower();
	            break;
	        case "Autowah": // Autowah
	            this.currentEffectNode = this.createAutowah();
	            break;
	        case "NoiseGate": // Noise gate
	            this.currentEffectNode = this.createNoiseGate();
	            break;
	        case "WahBass": // Wah Bass
	            var pingPong = this.createPingPongDelay(audioContext, (audioInput == this.realAudioInput), 0.5, 0.5 );
	            pingPong.output.connect( this.wetGain );
	            pingPong.input.connect( this.wetGain );
	            var tempWetGain = this.wetGain;
	            this.wetGain = pingPong.input;
	            this.wetGain = this.createAutowah();
	            this.currentEffectNode = this.createPitchShifter();
	            this.wetGain = tempWetGain;
	            break;
	        case "DistortedWahChorus": // Distorted Wah Chorus
	            var tempWetGain = this.wetGain;
	            this.wetGain = this.createStereoChorus();
	            this.wetGain = this.createDistortion();
	            this.currentEffectNode = this.createAutowah();
	            this.wetGain = tempWetGain;
	            this.waveshaper.setDrive(20);
	            break;
	        case "Vibrato": // Vibrato
	            this.currentEffectNode = this.createVibrato();
	            break;
	        case "BitCrusher": // BitCrusher
	            this.currentEffectNode = this.createBitCrusher();
	            break;
	        case "ApolloEffect": // Apollo effect
	            this.currentEffectNode = this.createApolloEffect();
	            break;
	        default:
	            break;
	    }
	    this.audioInput.connect( this.currentEffectNode );
	}
	
	this.crossfade = function(value) {
		// equal-power crossfade
		var gain1 = Math.cos(value * 0.5*Math.PI);
		var gain2 = Math.cos((1.0-value) * 0.5*Math.PI);
		
		this.dryGain.gain.value = gain1;
		this.wetGain.gain.value = gain2;
	}
	
	this.convertToMono = function( input ) {
	    var splitter = audioContext.createChannelSplitter(2);
	    var merger = audioContext.createChannelMerger(2);
	
	    input.connect( splitter );
	    splitter.connect( merger, 0, 0 );
	    splitter.connect( merger, 0, 1 );
	    return merger;
	}
	
	this.toggleMono = function() {
	    if (this.audioInput != this.realAudioInput) {
	        this.audioInput.disconnect();
	        this.realAudioInput.disconnect();
	        this.audioInput = this.realAudioInput;
	    } else {
	    	this.realAudioInput.disconnect();
	        this.audioInput = this.convertToMono( this.realAudioInput );
	    }
	
	    this.createLPInputFilter();
	    this.lpInputFilter.connect(dryGain);
	    this.lpInputFilter.connect(analyser1);
	    this.lpInputFilter.connect(effectInput);
	}
	
	this.createLPInputFilter = function(){
		this.lpInputFilter = audioContext.createBiquadFilter();
		this.lpInputFilter.frequency.value = 2048;
	    return this.lpInputFilter;
	}
	
	this.createTelephonizer = function() {
	    // I double up the filters to get a 4th-order filter = faster fall-off
	    var lpf1 = audioContext.createBiquadFilter();
	    lpf1.type = "lowpass";
	    lpf1.frequency.value = 2000.0;
	    var lpf2 = audioContext.createBiquadFilter();
	    lpf2.type = "lowpass";
	    lpf2.frequency.value = 2000.0;
	    var hpf1 = audioContext.createBiquadFilter();
	    hpf1.type = "highpass";
	    hpf1.frequency.value = 500.0;
	    var hpf2 = audioContext.createBiquadFilter();
	    hpf2.type = "highpass";
	    hpf2.frequency.value = 500.0;
	    lpf1.connect( lpf2 );
	    lpf2.connect( hpf1 );
	    hpf1.connect( hpf2 );
	    hpf2.connect( this.wetGain );
	    this.currentEffectNode = lpf1;
	    return( lpf1 );
	}
	
	this.createDelay = function() {
	    var delayNode = audioContext.createDelay();
	    
	    delayNode.delayTime.value = 0.15; //parseFloat( document.getElementById("dtime").value );	    
	    this.dtime = delayNode;
	
	    var gainNode = audioContext.createGain();
	    gainNode.gain.value = 0.75; //parseFloat( document.getElementById("dregen").value );	    
	    this.dregen = gainNode;
	    
	    gainNode.connect( delayNode );
	    delayNode.connect( gainNode );
	    delayNode.connect( this.wetGain );
	
	    return delayNode;
	}
	
	this.createReverb = function() {
	    var convolver = audioContext.createConvolver();
	    convolver.buffer = this.reverbBuffer; // impulseResponse( 2.5, 2.0 );  // reverbBuffer;
	    convolver.connect( this.wetGain );
	    return convolver;
	}
	
	this.waveshaper = null;
	
	this.createDistortion = function() {
	    if (!this.waveshaper)
	    	this.waveshaper = new WaveShaper( audioContext );
	
	    this.waveshaper.output.connect( this.wetGain );
	    this.waveshaper.setDrive(5.0);
	    return this.waveshaper.input;
	}
	
	this.createGainLFO = function() {
	    var osc = audioContext.createOscillator();
	    var gain = audioContext.createGain();
	    var depth = audioContext.createGain();
	
	    osc.type = "sine"; //document.getElementById("lfotype").value;
	    osc.frequency.value = 3; //parseFloat( document.getElementById("lfo").value );
	
	    gain.gain.value = 1.0; // to offset
	    depth.gain.value = 1.0;
	    osc.connect(depth); // scales the range of the lfo
	
	
	    depth.connect(gain.gain);
	    gain.connect( this.wetGain );
	    lfo = osc;
	    lfotype = osc;
	    lfodepth = depth;
	
	
	    osc.start(0);
	    return gain;
	}
	
	this.createFilterLFO = function() {
	    var osc = audioContext.createOscillator();
	    var gainMult = audioContext.createGain();
	    var gain = audioContext.createGain();
	    var filter = audioContext.createBiquadFilter();
	
	    filter.type = "lowpass";
	    filter.Q.value = 3.0; //parseFloat( document.getElementById("lplfoq").value );
	    lplfofilter = filter;
	
	    osc.type = 'sine';
	    osc.frequency.value = 3; //parseFloat( document.getElementById("lplfo").value );
	    osc.connect( gain );
	
	    filter.frequency.value = 2500;  // center frequency - this is kinda arbitrary.
	    gain.gain.value = 2500 * 1.0; //parseFloat( document.getElementById("lplfodepth").value );
	    // this should make the -1 - +1 range of the osc translate to 0 - 5000Hz, if
	    // depth == 1.
	
	    gain.connect( filter.frequency );
	    filter.connect( this.wetGain );
	    lplfo = osc;
	    lplfodepth = gain;
	
	    osc.start(0);
	    return filter;
	}
	
	this.createRingmod = function() {
	    var gain = audioContext.createGain();
	    var ring = audioContext.createGain();
	    var osc = audioContext.createOscillator();
	
	    osc.type = 'sine';
	    this.rmod = osc;
	    osc.frequency.value = Math.pow( 2, 11 ); //Math.pow( 2, parseFloat( document.getElementById("rmfreq").value ) );
	    osc.connect(ring.gain);
	
	    ring.gain.value = 0.0;
	    gain.connect(ring);
	    ring.connect(this.wetGain);
	    osc.start(0);
	    return gain;
	}
	
	this.awg = null;
	
	this.createChorus = function() {
	    var delayNode = audioContext.createDelay();
	    delayNode.delayTime.value = 0.03; //parseFloat( document.getElementById("cdelay").value );
	    this.cdelay = delayNode;
	
	    var inputNode = audioContext.createGain();
	
	    var osc = audioContext.createOscillator();
	    var gain = audioContext.createGain();
	
	    gain.gain.value = 0.002; //parseFloat( document.getElementById("cdepth").value ); // depth of change to the delay:
	    this.cdepth = gain;
	
	    osc.type = 'sine';
	    osc.frequency.value = 3.5; //parseFloat( document.getElementById("cspeed").value );
	    this.cspeed = osc;
	
	    osc.connect(gain);
	    gain.connect(delayNode.delayTime);
	
	    inputNode.connect( this.wetGain );
	    inputNode.connect( delayNode );
	    delayNode.connect( this.wetGain );
	
	
	    osc.start(0);
	
	    return inputNode;
	}
	
	this.createVibrato = function() {
	    var delayNode = audioContext.createDelay();
	    delayNode.delayTime.value = 0.03; //parseFloat( document.getElementById("vdelay").value );
	    this.cdelay = delayNode;
	
	    var inputNode = audioContext.createGain();
	
	    var osc = audioContext.createOscillator();
	    var gain = audioContext.createGain();
	
	    gain.gain.value = 0.002; //parseFloat( document.getElementById("vdepth").value ); // depth of change to the delay:
	    this.cdepth = gain;
	
	    osc.type = 'sine';
	    osc.frequency.value = 3.5; //parseFloat( document.getElementById("vspeed").value );
	    this.cspeed = osc;
	
	    osc.connect(gain);
	    gain.connect(delayNode.delayTime);
	    inputNode.connect( delayNode );
	    delayNode.connect( this.wetGain );
	    osc.start(0);
	
	    return inputNode;
	}
	
	this.createFlange = function() {
	    var delayNode = audioContext.createDelay();
	    delayNode.delayTime.value = 0.005; //parseFloat( document.getElementById("fldelay").value );
	    this.fldelay = delayNode;
	
	    var inputNode = audioContext.createGain();
	    var feedback = audioContext.createGain();
	    var osc = audioContext.createOscillator();
	    var gain = audioContext.createGain();
	    gain.gain.value = 0.002; //parseFloat( document.getElementById("fldepth").value );
	    this.fldepth = gain;
	
	    feedback.gain.value = 0.5; //parseFloat( document.getElementById("flfb").value );
	    flfb = feedback;
	
	    osc.type = 'sine';
	    osc.frequency.value = 0.25; //parseFloat( document.getElementById("flspeed").value );
	    this.flspeed = osc;
	
	    osc.connect(gain);
	    gain.connect(delayNode.delayTime);
	
	    inputNode.connect( this.wetGain );
	    inputNode.connect( delayNode );
	    delayNode.connect( this.wetGain );
	    delayNode.connect( feedback );
	    feedback.connect( inputNode );
	
	    osc.start(0);
	
	    return inputNode;
	}
	
	this.createStereoChorus = function() {
	    var splitter = audioContext.createChannelSplitter(2);
	    var merger = audioContext.createChannelMerger(2);
	    var inputNode = audioContext.createGain();
	
	    inputNode.connect( splitter );
	    inputNode.connect( this.wetGain );
	
	    var delayLNode = audioContext.createDelay();
	    var delayRNode = audioContext.createDelay();
	    delayLNode.delayTime.value = 0.03; //parseFloat( document.getElementById("scdelay").value );
	    delayRNode.delayTime.value = 0.03; //parseFloat( document.getElementById("scdelay").value );
	    this.scldelay = delayLNode;
	    this.scrdelay = delayRNode;
	    splitter.connect( delayLNode, 0 );
	    splitter.connect( delayRNode, 1 );
	
	    var osc = audioContext.createOscillator();
	    this.scldepth = audioContext.createGain();
	    this.scrdepth = audioContext.createGain();
	
	    this.scldepth.gain.value = 0.002; //parseFloat( document.getElementById("scdepth").value ); // depth of change to the delay:
	    this.scrdepth.gain.value = -0.002; //parseFloat( document.getElementById("scdepth").value ); // depth of change to the delay:
	
	    osc.type = 'triangle';
	    osc.frequency.value = 3.5; //parseFloat( document.getElementById("scspeed").value );
	    this.scspeed = osc;
	
	    osc.connect(this.scldepth);
	    osc.connect(this.scrdepth);
	
	    this.scldepth.connect(delayLNode.delayTime);
	    this.scrdepth.connect(delayRNode.delayTime);
	
	    delayLNode.connect( merger, 0, 0 );
	    delayRNode.connect( merger, 0, 1 );
	    merger.connect( this.wetGain );
	
	    osc.start(0);
	
	    return inputNode;
	}
	
	/*
	    Add modulation to delayed signal akin to ElectroHarmonix MemoryMan Guitar Pedal.
	    Simple combination of effects with great output hear on lots of records.
	    
	    FX Chain ASCII PIC:
	                v- FEEDBACK -|
	    INPUT -> DELAY -> CHORUS -> OUTPUT
	*/
	this.createModDelay = function() {
	    // Create input node for incoming audio
	    var inputNode = audioContext.createGain();
	
	    // SET UP DELAY NODE
	    var delayNode = audioContext.createDelay();
	    delayNode.delayTime.value = 0.15; //parseFloat( document.getElementById("mdtime").value );
	    this.mdtime = delayNode;
	
	    var feedbackGainNode = audioContext.createGain();
	    feedbackGainNode.gain.value = 0.5; //parseFloat( document.getElementById("mdfeedback").value );
	    this.mdfeedback = feedbackGainNode;
	
	
	    // SET UP CHORUS NODE
	    var chorus = audioContext.createDelay();
	    chorus.delayTime.value = 0.03; //parseFloat( document.getElementById("mddelay").value );
	    this.mddelay = chorus;
	
	    var osc  = audioContext.createOscillator();
	    var chorusRateGainNode = audioContext.createGain();
	    chorusRateGainNode.gain.value = 0.002; //parseFloat( document.getElementById("mddepth").value ); // depth of change to the delay:
	    this.mddepth = chorusRateGainNode;
	
	    osc.type = 'sine';
	    osc.frequency.value = 3.5; //parseFloat( document.getElementById("mdspeed").value );
	    this.mdspeed = osc;
	
	    osc.connect(chorusRateGainNode);
	    chorusRateGainNode.connect(chorus.delayTime);
	
	    // Connect the FX chain together
	    // create circular chain for delay to "feedback" to itself
	    inputNode.connect( delayNode );
	    delayNode.connect( chorus );
	    delayNode.connect( feedbackGainNode );
	    chorus.connect(feedbackGainNode);
	    feedbackGainNode.connect( delayNode );
	    feedbackGainNode.connect( this.wetGain );
	
	
	    osc.start(0);
	
	    return inputNode;
	}
	
	this.createStereoFlange = function() {
	    var splitter = audioContext.createChannelSplitter(2);
	    var merger = audioContext.createChannelMerger(2);
	    var inputNode = audioContext.createGain();
	    this.sfllfb = audioContext.createGain();
	    this.sflrfb = audioContext.createGain();
	    this.sflspeed = audioContext.createOscillator();
	    this.sflldepth = audioContext.createGain();
	    this.sflrdepth = audioContext.createGain();
	    this.sflldelay = audioContext.createDelay();
	    this.sflrdelay = audioContext.createDelay();
	
	
	    this.sfllfb.gain.value = this.sflrfb.gain.value = 0.9; //parseFloat( document.getElementById("sflfb").value );
	
	    inputNode.connect( splitter );
	    inputNode.connect( this.wetGain );
	
	    this.sflldelay.delayTime.value = 0.003; //parseFloat( document.getElementById("sfldelay").value );
	    this.sflrdelay.delayTime.value = 0.003; //parseFloat( document.getElementById("sfldelay").value );
	
	    splitter.connect( this.sflldelay, 0 );
	    splitter.connect( this.sflrdelay, 1 );
	    this.sflldelay.connect( this.sfllfb );
	    this.sflrdelay.connect( this.sflrfb );
	    this.sfllfb.connect( this.sflrdelay );
	    this.sflrfb.connect( this.sflldelay );
	
	    this.sflldepth.gain.value = 0.005; //parseFloat( document.getElementById("sfldepth").value ); // depth of change to the delay:
	    this.sflrdepth.gain.value = - 0.005; //parseFloat( document.getElementById("sfldepth").value ); // depth of change to the delay:
	
	    this.sflspeed.type = 'triangle';
	    this.sflspeed.frequency.value = 0.15; //parseFloat( document.getElementById("sflspeed").value );
	
	    this.sflspeed.connect( this.sflldepth );
	    this.sflspeed.connect( this.sflrdepth );
	
	    this.sflldepth.connect( this.sflldelay.delayTime );
	    this.sflrdepth.connect( this.sflrdelay.delayTime );
	
	    this.sflldelay.connect( merger, 0, 0 );
	    this.sflrdelay.connect( merger, 0, 1 );
	    merger.connect( this.wetGain );
	
	    this.sflspeed.start(0);
	
	    return inputNode;
	}
	
	this.createPitchShifter = function() {
		this.effect = new Jungle( audioContext );
	    this.effect.output.connect( this.wetGain );
	    return effect.input;
	}
	
	this.createEnvelopeFollower = function() {
	    var waveshaper = audioContext.createWaveShaper();
	    var lpf1 = audioContext.createBiquadFilter();
	    lpf1.type = "lowpass";
	    lpf1.frequency.value = 10.0;
	
	    var curve = new Float32Array(65536);
	    for (var i=-32768; i<32768; i++)
	        curve[i+32768] = ((i>0)?i:-i)/32768;
	    waveshaper.curve = curve;
	    waveshaper.connect(lpf1);
	    lpf1.connect(this.wetGain);
	    return waveshaper;
	}
	
	this.createAutowah = function() {
	    var inputNode = audioContext.createGain();
	    var waveshaper = audioContext.createWaveShaper();
	    this.awFollower = audioContext.createBiquadFilter();
	    this.awFollower.type = "lowpass";
	    this.awFollower.frequency.value = 10.0;
	
	    var curve = new Float32Array(65536);
	    for (var i=-32768; i<32768; i++)
	        curve[i+32768] = ((i>0)?i:-i)/32768;
	    waveshaper.curve = curve;
	    waveshaper.connect(this.awFollower);
	
	    this.awDepth = audioContext.createGain();
	    this.awDepth.gain.value = 11585;
	    this.awFollower.connect(this.awDepth);
	
	    this.awFilter = audioContext.createBiquadFilter();
	    this.awFilter.type = "lowpass";
	    this.awFilter.Q.value = 15;
	    this.awFilter.frequency.value = 50;
	    this.awDepth.connect(this.awFilter.frequency);
	    this.awFilter.connect(this.wetGain);
	
	    inputNode.connect(waveshaper);
	    inputNode.connect(this.awFilter);
	    return inputNode;
	}
	
	this.createNoiseGate = function() {
	    var inputNode = audioContext.createGain();
	    var rectifier = audioContext.createWaveShaper();
	    this.ngFollower = audioContext.createBiquadFilter();
	    this.ngFollower.type = "lowpass";
	    this.ngFollower.frequency.value = 10.0;
	
	    var curve = new Float32Array(65536);
	    for (var i=-32768; i<32768; i++)
	        curve[i+32768] = ((i>0)?i:-i)/32768;
	    rectifier.curve = curve;
	    rectifier.connect(this.ngFollower);
	
	    this.ngGate = audioContext.createWaveShaper();
	    this.ngGate.curve = generateNoiseFloorCurve(0.01); //generateNoiseFloorCurve(parseFloat(document.getElementById("ngFloor").value));
	
	    this.ngFollower.connect(this.ngGate);
	
	    var gateGain = audioContext.createGain();
	    gateGain.gain.value = 0.0;
	    this.ngGate.connect( gateGain.gain );
	
	    gateGain.connect( this.wetGain);
	
	    inputNode.connect(rectifier);
	    inputNode.connect(gateGain);
	    return inputNode;
	}
	
	this.generateNoiseFloorCurve = function( floor ) {
	    // "floor" is 0...1
	
	    var curve = new Float32Array(65536);
	    var mappedFloor = floor * 32768;
	
	    for (var i=0; i<32768; i++) {
	        var value = (i<mappedFloor) ? 0 : 1;
	
	        curve[32768-i] = -value;
	        curve[32768+i] = value;
	    }
	    curve[0] = curve[1]; // fixing up the end.
	
	    return curve;
	}
	
	function generateNoiseFloorCurve( floor ){
	    // "floor" is 0...1
		
	    var curve = new Float32Array(65536);
	    var mappedFloor = floor * 32768;
	
	    for (var i=0; i<32768; i++) {
	        var value = (i<mappedFloor) ? 0 : 1;
	
	        curve[32768-i] = -value;
	        curve[32768+i] = value;
	    }
	    curve[0] = curve[1]; // fixing up the end.
	
	    return curve;
	}
	
	this.setBitCrusherDepth = function( bits ) {
	    var length = Math.pow(2, bits);
	    console.log("setting bitcrusher depth to " + bits + " bits, length = " + length );
	    var curve = new Float32Array( length );
	
	    var lengthMinusOne = length - 1;
	
	    for (var i=0; i<length; i++)
	        curve[i] = (2 * i / lengthMinusOne) - 1;
	
	    if (bitCrusher)
	        bitCrusher.curve = curve;
	}
	
	this.btcrBufferSize = 4096;
	
	this.createBitCrusher = function() {
	    var bitCrusher = audioContext.createScriptProcessor(this.btcrBufferSize, 1, 1);
	    var phaser = 0;
	    var last = 0;
	
	    bitCrusher.onaudioprocess = function(e) {
	        var step = Math.pow(1/2, this.btcrBits);
	        for (var channel=0; channel<e.inputBuffer.numberOfChannels; channel++) {
	            var input = e.inputBuffer.getChannelData(channel);
	            var output = e.outputBuffer.getChannelData(channel);
	            for (var i = 0; i < this.btcrBufferSize; i++) {
	                phaser += this.btcrNormFreq;
	                if (phaser >= 1.0) {
	                    phaser -= 1.0;
	                    last = step * Math.floor(input[i] / step + 0.5);
	                }
	                output[i] = last;
	            }
	        }
	    };
	    bitCrusher.connect( this.wetGain );
	    return bitCrusher;
	}
	
	//btcrBits = 16,
	//btcrNormFreq
	
	this.impulseResponse = function( duration, decay, reverse ) {
	    var sampleRate = audioContext.sampleRate;
	    var length = sampleRate * duration;
	    var impulse = audioContext.createBuffer(2, length, sampleRate);
	    var impulseL = impulse.getChannelData(0);
	    var impulseR = impulse.getChannelData(1);
	
	    if (!decay)
	        decay = 2.0;
	    for (var i = 0; i < length; i++){
	      var n = reverse ? length - i : i;
	      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
	      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
	    }
	    return impulse;
	}

	this.beepGain = null;
	this.apolloGate = null;
	
	this.createApolloEffect = function() {
		// Step 1: create band limiter with output delay
	    // I double up the filters to get a 4th-order filter = faster fall-off
	    var lpf1 = audioContext.createBiquadFilter();
	    lpf1.type = "lowpass";
	    lpf1.frequency.value = 2000.0;
	    var lpf2 = audioContext.createBiquadFilter();
	    lpf2.type = "lowpass";
	    lpf2.frequency.value = 2000.0;
	    var hpf1 = audioContext.createBiquadFilter();
	    hpf1.type = "highpass";
	    hpf1.frequency.value = 500.0;
	    var hpf2 = audioContext.createBiquadFilter();
	    hpf2.type = "highpass";
	    hpf2.frequency.value = 500.0;
	    lpf1.connect( lpf2 );
	    lpf2.connect( hpf1 );
	    hpf1.connect( hpf2 );

	    // create delay to make room for the intro beep
	    var delay = audioContext.createDelay();
	    delay.delayTime.setValueAtTime(0.100, 0);
	    delay.connect( this.wetGain );
	    hpf2.connect( delay );

	    //Step 2: create the volume tracker to connect to the beeper
		var volumeprocessor = audioContext.createScriptProcessor(512);
		volumeprocessor.onaudioprocess = this.volumeAudioProcess;

		var zeroGain = audioContext.createGain();
		zeroGain.gain.setValueAtTime(0,0);
		zeroGain.connect(audioContext.destination);
		volumeprocessor.connect(zeroGain);

	    //Step 3: create the noise gate
	    var inputNode = audioContext.createGain();
	    var rectifier = audioContext.createWaveShaper();
	    ngFollower = audioContext.createBiquadFilter();
	    ngFollower.type = "lowpass";
	    ngFollower.frequency.value = 10.0;

	    var curve = new Float32Array(65536);
	    for (var i=-32768; i<32768; i++)
	        curve[i+32768] = ((i>0)?i:-i)/32768;
	    rectifier.curve = curve;
	    rectifier.connect(ngFollower);
	    this.apolloGate = audioContext.createWaveShaper();
	    this.apolloGate.curve = generateNoiseFloorCurve( 0.02 );
	    ngFollower.connect(this.apolloGate);

	    var gateGain = audioContext.createGain();
	    gateGain.gain.value = 0.0;
	    this.apolloGate.connect( gateGain.gain );
	    gateGain.connect( lpf1 );
	    gateGain.connect( volumeprocessor );
	    inputNode.connect(rectifier);
	    inputNode.connect(gateGain);

	    return( inputNode );
	}

	function playQuindarTone( intro ) {
		if (!this.beepGain) {
			this.beepGain=audioContext.createGain();
			this.beepGain.gain.value = 0.25;
			this.beepGain.connect(audioContext.destination);
		}
		var osc=audioContext.createOscillator();
		osc.frequency.setValueAtTime( intro ? 2525 : 2475, 0);
		osc.connect(this.beepGain);
		osc.start(0);
		osc.stop(audioContext.currentTime+0.25);
	}

	var wasSilent = true;
	var lastNoise = 0;
	var waitingForOutro=false;
	var OUTRODELAY=0.5;  // trailing edge delay, in seconds

	this.volumeAudioProcess = function( event ) {
		var buf = event.inputBuffer.getChannelData(0);
	    var bufLength = buf.length;
		var sum = 0;
	    var x;
	    var currentlySilent = true;

		// Do a root-mean-square on the samples: sum up the squares...
	    for (var i=0; i<bufLength; i++) {
	    	currentlySilent = currentlySilent && (buf[i]==0.0);
	    }

	    if (wasSilent&&currentlySilent) {
	    	if (waitingForOutro) {
	    		if ((lastNoise+OUTRODELAY)<event.playbackTime) {
		    		playQuindarTone(false);
			    	waitingForOutro=false;
			    }
	    	}
	    	return;
	    }
	    if (wasSilent) { // but not currently silent - leading edge
	    	if (!waitingForOutro) {
	    		playQuindarTone(true);
	    		waitingForOutro=true;
	    	}
	    	wasSilent=false;
	    	return;
	    }
	    if (currentlySilent) {  // but wasn't silent - trailing edge
	    	lastNoise=event.playbackTime;
	    	wasSilent=true;
	    }
	}

	this.createPingPongDelay = function(context, isTrueStereo, delayTime, feedback) {
	    var effect = new Effect();
	    var merger = context.createChannelMerger(2);
	    var leftDelay = context.createDelay();
	    var rightDelay = context.createDelay();
	    var leftFeedback = audioContext.createGain();
	    var rightFeedback = audioContext.createGain();
	    var splitter = context.createChannelSplitter(2);

	    // Split the stereo signal.
	    splitter.connect( leftDelay, 0 );

	    // If the signal is dual copies of a mono signal, we don't want the right channel - 
	    // it will just sound like a mono delay.  If it was a real stereo signal, we do want
	    // it to just mirror the channels.
	    if (isTrueStereo)
	        splitter.connect( rightDelay, 1 );

	    leftDelay.delayTime.value = delayTime;
	    rightDelay.delayTime.value = delayTime;
	    
	    leftFeedback.gain.value = feedback;
	    rightFeedback.gain.value = feedback;

	    // Connect the routing - left bounces to right, right bounces to left.
	    leftDelay.connect(leftFeedback);
	    leftFeedback.connect(rightDelay);
	    
	    rightDelay.connect(rightFeedback);
	    rightFeedback.connect(leftDelay);
	    
	    // Re-merge the two delay channels into stereo L/R
	    leftFeedback.connect(merger, 0, 0);
	    rightFeedback.connect(merger, 0, 1);
	    
	    effect.addLinearControls( [leftDelay.delayTime, rightDelay.delayTime], "Delay", 0.01, 2.0, 0.01, delayTime );
	    effect.addLinearControls( [leftFeedback.gain, rightFeedback.gain], "Feedback", 0.01, 1.0, 0.01, feedback );

	    effect.input = splitter;
	    effect.output = merger;
	    return effect;
	}
	
}