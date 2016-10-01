/* --- start Audio Stream Visualizer (not used) --- */
/*
//var visualizer  = new this.streamVisualizer(streamAudio);
this.streamVisualizer = function(audioSource){

	var audioContext = audioSource.audioContext;
	var audioStream = audioSource.audioStream;

    script_processor_node = audioContext.createScriptProcessor(16384, 1, 1);

    audioStream.connect(script_processor_node);
    script_processor_analysis_node = audioContext.createScriptProcessor(2048, 1, 1);

	// A Random Color
	this.randColor = function(){
		var color = [];
        for(var i=0; i<3; i++){
            color.push(Math.floor(Math.random()*256));
        }
        return 'rgb('+color.join(',')+')';
	};

    this.analyser = audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0;
    this.analyser.fftSize = 2048;
	this.analyser.minDecibels = -140;
	this.analyser.maxDecibels = 0;

    audioStream.connect(this.analyser);
    this.analyser.connect(script_processor_analysis_node);

	this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
	this.times = new Uint8Array(this.analyser.frequencyBinCount);

	this.startTime = 0;
	this.startOffset = 0;
    this.baseColor =  this.randColor();

	this.canvas = document.createElement('canvas');
	this.canvas.width = 320; this.canvas.height = 240;
	this.canvas.style.backgroundColor = this.baseColor;

	this.drawContext = this.canvas.getContext('2d');

	this.audioWidth = this.canvas.width; //this.drawContext.canvas.width;
	this.audioHeight = this.canvas.height; //this.drawContext.canvas.height;

	return this;

};

// *** 2D analyser (not used) *** //
this.analyser2D = function(){

	var visualizer = this.fx_audio[i].visualizer;
	var canvas = visualizer.canvas;
	var drawContext = visualizer.drawContext;
	var analyser = visualizer.analyser;
	var audioWidth = visualizer.audioWidth;
	var audioHeight = visualizer.audioHeight;
	var freqs = visualizer.freqs;
	var times = visualizer.times;
	var baseColor = visualizer.baseColor;

	analyser.smoothingTimeConstant = 0.4; // <--- This value can be changed -- //
	analyser.fftSize = 2048; // <--- This value can be changed -- //

	// --- Get the frequency data from the currently playing music --- //
	analyser.getByteFrequencyData(freqs);
	analyser.getByteTimeDomainData(times);

	// Clear Canvas
	drawContext.fillStyle = baseColor;
	drawContext.fillRect(0, 0, canvas.width, canvas.height);

	// --- Draw the time domain chart. --- //
	for (a = 0; a < analyser.frequencyBinCount; a++) {
	    this.value = times[a];
	    this.percent = this.value / 256;
	    this.height = audioHeight * this.percent;
	    this.offset = audioHeight - this.height - 1;
	    this.barWidth = audioWidth / analyser.frequencyBinCount;
	    drawContext.fillStyle = 'white';
	    drawContext.fillRect(a * this.barWidth, this.offset, 1, 2);
	}
}
*/