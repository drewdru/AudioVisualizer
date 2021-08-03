AudioContext = window.AudioContext || window.webkitAudioContext
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

let stream
let mediaRecorder
let audioContext
let microphoneSource
let oscillatorNode
let gainNode
let player

window.addEventListener("load", () => {
  initStream()
})

async function initStream() {
  // player = document.getElementById("player")
  stream = await navigator.mediaDevices.getUserMedia({ audio: true})

  audioContext = new AudioContext()
  microphoneSource = audioContext.createMediaStreamSource(stream)

  oscillatorNode = audioContext.createOscillator()
  gainNode = audioContext.createGain()

  console.log(oscillatorNode, gainNode)

  oscillatorNode.connect(gainNode).connect(audioContext.destination);
  microphoneSource.connect(audioContext.destination)

  // mediaRecorder = new MediaRecorder(stream)
  // console.log(stream)

  // let voice = [];
  // mediaRecorder.addEventListener("dataavailable", (event) => {
  //   console.log(event.data)
  //   const voiceBlob = new Blob(event.data, {
  //     type: 'audio/wav'
  //   });
  // });
}

function startRecord() {
  // mediaRecorder.start();
  // console.log(stream)
}
function stopRecord() {
  // mediaRecorder.stop();
  // console.log(stream)
}

function logStreamData() {
  console.log(oscillatorNode, gainNode)
}