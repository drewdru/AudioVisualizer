AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

let audioVisualizer;
window.addEventListener("load", () => {
  const audioVisualizer = new AudioVisualizer();
  // init();
})

class AudioVisualizer {
  constructor() {
    this.canvas = document.querySelector('.visualizer');
    this.canvasContext = this.canvas.getContext("2d");
    const intendedWidth = document.querySelector('.wrapper').clientWidth;    
    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;
    this.canvas.setAttribute('width', intendedWidth);

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    // this.analyser.minDecibels = -90;
    // this.analyser.maxDecibels = -10;
    // this.analyser.smoothingTimeConstant = 0.85;
    this.bufferLength = undefined;
    this.dataArray = undefined;

    this.source = undefined;
    this.stream = undefined;
    this.distortion = this.audioContext.createWaveShaper();
    this.gainNode = this.audioContext.createGain();
    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.convolver = this.audioContext.createConvolver();

    this.drawVisual = undefined;
    this.getAudioMedia();
  }
  async getAudioMedia() {
    if (!navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia not supported on your browser!');
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
    } catch(error) {
      console.error('Error getting microphone', error);
    }
    this.source = this.audioContext.createMediaStreamSource(this.stream);

    this.source.connect(this.distortion);
    this.distortion.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode);
    // this.convolver.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.visualize();
    this.voiceChange();
  }

  visualize() {
    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;
    // this.analyser.fftSize = 256;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.canvasContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.drawFrequencybars();
  }

  drawFrequencybars() {
    this.drawVisual = requestAnimationFrame(this.drawFrequencybars.bind(this));
    this.analyser.getByteFrequencyData(this.dataArray);
    this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
    this.canvasContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    const barWidth = (this.WIDTH / this.bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for(let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i];
      this.canvasContext.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      this.canvasContext.fillRect(x, this.HEIGHT-barHeight/2, barWidth, barHeight/2);
      x += barWidth + 1;
    }
  }
  voiceChange() {
    // this.distortion.oversample = '4x';
    // this.biquadFilter.gain.setTargetAtTime(0, this.audioContext.currentTime, 0)
    // this.biquadFilter.disconnect(0);
    // this.biquadFilter.connect(this.gainNode);
  }

}

/*
if(visualSetting === "sinewave") {
  analyser.fftSize = 2048;
  var bufferLength = analyser.fftSize;
  console.log(bufferLength);
  var dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  var draw = function() {

    drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
  };

  draw();

} else if(visualSetting == "frequencybars") {
} else if(visualSetting == "off") {
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  canvasCtx.fillStyle = "red";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
}*/


// function init() {

//   function visualize() {
//     var visualSetting = visualSelect.value;
//     console.log(visualSetting);


//   }

//   function voiceChange() {

//     distortion.oversample = '4x';
//     biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)

//     var voiceSetting = voiceSelect.value;
//     console.log(voiceSetting);

//     //when convolver is selected it is connected back into the audio path
//     if(voiceSetting == "convolver") {
//       biquadFilter.disconnect(0);
//       biquadFilter.connect(convolver);
//     } else {
//       biquadFilter.disconnect(0);
//       biquadFilter.connect(gainNode);

//       if(voiceSetting == "distortion") {
//         distortion.curve = makeDistortionCurve(400);
//       } else if(voiceSetting == "biquad") {
//         biquadFilter.type = "lowshelf";
//         biquadFilter.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0)
//         biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0)
//       } else if(voiceSetting == "off") {
//         console.log("Voice settings turned off");
//       }
//     }
//   }

//   // event listeners to change visualize and voice settings

//   visualSelect.onchange = function() {
//     window.cancelAnimationFrame(drawVisual);
//     visualize();
//   };

//   voiceSelect.onchange = function() {
//     voiceChange();
//   };

//   mute.onclick = voiceMute;

//   function voiceMute() {
//     if(mute.id === "") {
//       gainNode.gain.value = 0;
//       mute.id = "activated";
//       mute.innerHTML = "Unmute";
//     } else {
//       gainNode.gain.value = 1;
//       mute.id = "";
//       mute.innerHTML = "Mute";
//     }
//   }
// }
