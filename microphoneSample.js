AudioContext = window.AudioContext || window.webkitAudioContext;

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

class AudioVisualizer {
  constructor() {
    this.WIDTH = 640;
    this.HEIGHT = 480;
    this.canvas = document.querySelector('canvas');
    this.drawContext = this.canvas.getContext('2d');

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;


    this.getMicrophoneInput();
  }

  getMicrophoneInput() {
    navigator.getUserMedia(
      {audio: true},
      this.onStream.bind(this),
      this.onStreamError.bind(this),
    );
  }
  onStream(stream) {
    console.log("onStream", stream)
    const input = this.audioContext.createMediaStreamSource(stream);
    const filter = this.audioContext.createBiquadFilter();
    // filter.frequency.value = 60.0;
    // filter.type = filter.NOTCH;
    // filter.Q = 10.0;
  
  
    // Connect graph.
    input.connect(filter);
    filter.connect(this.analyser);
    
    // Setup a timer to visualize some stuff.
    window.requestAnimationFrame(this.visualize.bind(this));
  }
  onStreamError(e) {
    console.error('Error getting microphone', e);
  };
  visualize() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);

    this.drawContext.fillStyle = 'rgb(200, 200, 200)';
    this.drawContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    this.drawContext.lineWidth = 2;
    this.drawContext.strokeStyle = 'rgb(0, 0, 0)';
    this.drawContext.beginPath();
    const sliceWidth = this.WIDTH * 1.0 / bufferLength;

    let x = 0;
    for(let i = 0; i < bufferLength; i++) {
      const value = dataArray[i] / 128.0;
      let y = value * this.HEIGHT/2;
      if(i === 0) {
        this.drawContext.moveTo(x, y);
      } else {
        this.drawContext.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.drawContext.lineTo(this.canvas.width, this.canvas.height/2);
    this.drawContext.stroke();
    window.requestAnimationFrame(this.visualize.bind(this));
  }
  // visualize() {
  //   this.canvas.width = this.WIDTH;
  //   this.canvas.height = this.HEIGHT;
  //   var drawContext = this.canvas.getContext('2d');
  
  //   var times = new Uint8Array(this.analyser.frequencyBinCount);
  //   this.analyser.getByteTimeDomainData(times);
  //   for (var i = 0; i < times.length; i++) {
  //     var value = times[i];
  //     var percent = value / 256;
  //     var height = this.HEIGHT * percent;
  //     var offset = this.HEIGHT - height - 1;
  //     var barWidth = this.WIDTH/times.length;
  //     drawContext.fillStyle = 'black';
  //     drawContext.fillRect(i * barWidth, offset, 1, 1);
  //   }
  //   window.requestAnimationFrame(this.visualize.bind(this));
  // };
}

const audioVisualizer = new AudioVisualizer();