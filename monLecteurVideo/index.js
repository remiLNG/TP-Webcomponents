import "./lib/webaudio-controls.js";

const getBaseURL = () => {
  return new URL(".", import.meta.url);
};

let style = `
.buttonList {
     text-align: center;
   
}
.webaudio,.frequency{
  margin-top:2%;
}
#player{
    margin: auto;
    display: block;
    width: 30%;
    height: 30%;
}


.durationTime{
  text-align: center;

}

#duration{
  font-size: 25px;
  font-weight: bold;
  color: white; 
}


#onOffImg {
  width: 30px;
  text-align:center;
margin:auto;
display:flex;
padding-top:1%;
}


#play,#load,#avance10,#recule10,#changeVideo,#previous,#next{
  padding: 15px 25px; 
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 15px;

}


#play{
  background-color: darkolivegreen;
}

#load{
  background-color: #8FBC8F;
}

#avance10,#recule10{
  background-color:#2F4F4F;
}

#changeVideo{
  background-color: #BC8F8F;
}

#next,#previous{
  background-color: #708090;

}



#play:active, #load:active, #avance10:active ,#recule10:active ,#changeVideo:active, #previous:active,#next:active {
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}


#vitesseFast,#mute,#vitesseSlow,#volume,#knobBalance,#gain0,#gain1,#gain2,#gain3,#gain4,#gain5{
  font-size: 15px;
  font-weight: bold;
  color: white; 
}

.form{
 text-align:center;
 padding: 1%;
}

input[type=text] {
  border: 2mm solid  #BC8F8F;
  background-color: white;
  border-radius: 30px;
  width: 20%;
  height: 5%;
  font-size: 30px;
}

input:focus {
  background-color: white;
  color: black
}

#canvas{
  margin-top: 1%;
  background-color: black;
}


`;
let template = /*html*/ `
<div class="form">
<input type="text" id="videoSrc" >
     <button id="changeVideo">LINK</button>
     </div>
  <video id="player" crossorigin="anonymous" >
      <br>
  </video>
  <img id="onOffImg" src="./monLecteurVideo/assets/pauseState.png" alt="onOffImage" />
  <div class="durationTime">
  <canvas id="canvas" width=400 height=50></canvas>
  <p id="duration"> </p>
  </div>
  <div class="buttonList">
  <button  id="load">LOAD</button>
  <button id="play">PLAY</button>
  <button id="previous">PREVIOUS</button>
  <button id="next">NEXT</button>
  <button id="recule10">-10s</button>
  <button id="avance10">+10s</button>

  <div class="webaudio">
  <webaudio-switch id="mute" diameter="50" src="./assets/mute.png" type="toggle">Mute</webaudio-switch>
  <webaudio-knob id="volume" diameter="90" src="./assets/volumeButton.png" tooltip="%s" sprites="30" value=0.5 min="0" max="1" step=0.01>Volume</webaudio-knob>
  <webaudio-knob id="vitesseFast" diameter="90" src="./assets/balanceButton.png" tooltip="%s" sprites="127" value=1 min="1" max="4" step=0.1>Accélérer</webaudio-knob>
  <webaudio-knob id="vitesseSlow" diameter="90" src="./assets/balanceButton.png" tooltip="%s" sprites="127" value=1 min="0.1" max="1" step=0.1>Ralentir</webaudio-knob>
  <webaudio-knob id="knobBalance"  diameter="90" tooltip="%s hz" src="./assets/slider.png"  sprites="127" value=0 min="-1" max="1" step=0.1>Balance</webaudio-knob>
 </div>


 <div class="frequency">
 <webaudio-knob id="gain0"   tooltip="%s dB" src="./assets/frequency.png" sprites="30" value=0 min="-30" max="30" step=1>60 Hz</webaudio-knob>
 <webaudio-knob id="gain1"   tooltip="%s dB" src="./assets/frequency.png" sprites="30" value=0 min="-30" max="30" step=1>170 Hz</webaudio-knob>
 <webaudio-knob id="gain2"   tooltip="%s dB" src="./assets/frequency.png" sprites="30" value=0 min="-30" max="30" step=1>350 Hz</webaudio-knob>
 <webaudio-knob id="gain3"   tooltip="%s dB" src="./assets/frequency.png" sprites="30" value=0 min="-30" max="30" step=1>1000 Hz</webaudio-knob>
 <webaudio-knob id="gain4"   tooltip="%s dB" src="./assets/frequency.png" sprites="30" value=0 min="-30" max="30" step=1>3500 Hz</webaudio-knob>
 <webaudio-knob id="gain5"   tooltip="%s dB" src="./assets/frequency.png" sprites="30" value=0 min="-30" max="30" step=1>10000 Hz</webaudio-knob>

 </div>
  </div>
   `;

let timesClicked = 0;
let switchVideo = 0;
let startButtonState;
let audioCtx = window.AudioContext || window.webkitAudioContext;
let videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  " http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  " http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
];

let filters = [];

class MyVideoPlayer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  fixRelativeURLs() {
    // pour les knobs
    let knobs = this.shadowRoot.querySelectorAll(
      "webaudio-knob, webaudio-switch, webaudio-slider"
    );
    knobs.forEach((e) => {
      let path = e.getAttribute("src");
      e.src = getBaseURL() + "/" + path;
    });
  }
  connectedCallback() {
    // Appelée avant affichage du composant
    //this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;
    this.shadowRoot.querySelector("#previous").disabled = true;

    this.fixRelativeURLs();

    this.player = this.shadowRoot.querySelector("#player");
    // récupération de l'attribut HTML
    this.player.src = this.getAttribute("src");

    this.canvas = this.shadowRoot.querySelector("#canvas");

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvasContext = this.canvas.getContext("2d");

    // déclarer les écouteurs sur les boutons
    this.definitEcouteurs();
    this.buildAudioGraph();
    requestAnimationFrame(() => this.visualize());
    this.drawAnimation();
  }

  definitEcouteurs() {
    this.shadowRoot.querySelector("#load").onclick = () => {
      this.load();
    };
    this.shadowRoot.querySelector("#play").onclick = () => {
      this.play();
    };

    this.shadowRoot.querySelector("#previous").onclick = () => {
      this.previousVideo();
      console.log("je recule : " + switchVideo);
      console.log(videos[switchVideo]);
    };

    this.shadowRoot.querySelector("#next").onclick = () => {
      this.nextVideo();
      console.log("j'avance : " + switchVideo);
      console.log(videos[switchVideo]);
    };

    this.shadowRoot.querySelector("#avance10").onclick = () => {
      this.avance10();
    };

    this.shadowRoot.querySelector("#recule10").onclick = () => {
      this.recule10();
    };

    this.shadowRoot.querySelector("#volume").oninput = (event) => {
      const vol = parseFloat(event.target.value);
      this.player.volume = vol;
    };

    this.shadowRoot.querySelector("#vitesseFast").oninput = (event) => {
      let vitesse = parseFloat(event.target.value);
      this.player.playbackRate = vitesse;
    };

    this.shadowRoot.querySelector("#vitesseSlow").oninput = (event) => {
      let vitesse = parseFloat(event.target.value);
      this.player.playbackRate = vitesse;
    };
    this.shadowRoot.querySelector("#mute").onclick = () => {
      this.mute();
      timesClicked++;
    };
    this.shadowRoot.querySelector("#knobBalance").oninput = (event) => {
      let value = parseFloat(event.target.value);
      this.stereoPanner.pan.value = value;
    };

    this.shadowRoot.querySelector("#changeVideo").onclick = () => {
      this.changeVideo();
      this.shadowRoot.querySelector("#videoSrc").value = "";
    };

    this.shadowRoot.querySelector("#gain0").oninput = (event) => {
      let value = parseFloat(event.target.value);
      filters[0].gain.value = value;
    };
    this.shadowRoot.querySelector("#gain1").oninput = (event) => {
      let value = parseFloat(event.target.value);
      filters[1].gain.value = value;
    };
    this.shadowRoot.querySelector("#gain2").oninput = (event) => {
      let value = parseFloat(event.target.value);
      filters[2].gain.value = value;
    };
    this.shadowRoot.querySelector("#gain3").oninput = (event) => {
      let value = parseFloat(event.target.value);
      filters[3].gain.value = value;
    };
    this.shadowRoot.querySelector("#gain4").oninput = (event) => {
      let value = parseFloat(event.target.value);
      filters[4].gain.value = value;
    };
    this.shadowRoot.querySelector("#gain5").oninput = (event) => {
      let value = parseFloat(event.target.value);
      filters[5].gain.value = value;
    };
  }

  buildAudioGraph() {
    this.audioContext = new audioCtx();

    const interval = setInterval(() => {
      if (this.player) {
        this.player.onplay = (e) => {
          this.audioContext.resume();
        };

        this.sourceNode = this.audioContext.createMediaElementSource(
          this.player
        );
        this.analyser = this.audioContext.createAnalyser();

        this.analyser.fftSize = 512;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        // Set filters
        [60, 170, 350, 1000, 3500, 10000].forEach((freq, i) => {
          let eq = this.audioContext.createBiquadFilter();
          eq.frequency.value = freq;
          eq.type = "peaking";
          eq.gain.value = 0;
          filters.push(eq);
        });

        // Connect filters in serie
        this.sourceNode.connect(filters[0]);
        for (var i = 0; i < filters.length - 1; i++) {
          filters[i].connect(filters[i + 1]);
        }

        // Master volume is a gain node
        this.masterGain = this.audioContext.createGain();
        this.masterGain.value = 1;

        filters[filters.length - 1].connect(this.masterGain);

        // for stereo balancing, split the signal
        this.stereoPanner = this.audioContext.createStereoPanner();
        // connect master volume output to the panner
        this.masterGain.connect(this.stereoPanner);
        // Connect the stereo panner to analyser and analyser to destination
        this.analyser.connect(this.audioContext.destination);
        this.stereoPanner.connect(this.analyser);

        // this.sourceNode.connect(this.stereoPanner);
        // this.sourceNode.connect(this.analyser);
        // this.stereoPanner.connect(this.audioContext.destination);
        clearInterval(interval);
      }
    }, 500);
  }

  visualize() {
    if (!this.analyser) {
      setTimeout(() => {
        requestAnimationFrame(() => this.visualize());
      }, 100);
      return;
    }

    this.canvasContext.clearRect(0, 0, this.width, this.height);
    this.analyser.getByteFrequencyData(this.dataArray);

    const barWidth = this.width / this.bufferLength;
    let barHeight;
    let x = 0;
    const heightScale = this.height / 128;

    for (let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i];
      this.canvasContext.fillStyle = "rgb(" + (barHeight + 100) + ", 255, 0)";
      barHeight *= heightScale;
      this.canvasContext.fillRect(
        x,
        this.height - barHeight / 2,
        barWidth,
        barHeight / 2
      );
      x += barWidth + 1;
    }
    requestAnimationFrame(() => this.visualize());
  }

  changePlayButton(state) {
    let onOffImg = this.shadowRoot.querySelector("#onOffImg");
    let playButton = this.shadowRoot.querySelector("#play");
    if (state) {
      this.audioContext.resume();
      this.player.play();
      onOffImg.setAttribute("src", "./monLecteurVideo/assets/playState.png");
      playButton.innerHTML = "PAUSE";
      playButton.style.backgroundColor = "indianred";
      this.shadowRoot.querySelector("#load").disabled = true;
    } else {
      this.player.pause();
      onOffImg.setAttribute("src", "./monLecteurVideo/assets/pauseState.png");
      playButton.innerHTML = "PLAY";
      playButton.style.backgroundColor = "darkolivegreen";
      this.shadowRoot.querySelector("#load").disabled = false;
    }
  }

  formatTimer(s) {
    s = ~~s;
    let secs = s % 60;
    s = (s - secs) / 60;
    let minutes = s % 60;
    let hours = (s - minutes) / 60;
    secs = +secs > 10 ? ":" + secs : ":" + 0 + "" + secs;
    minutes = minutes > 10 ? minutes : 0 + "" + minutes;
    hours = hours >= 1 ? hours + ":" : "";
    return hours + minutes + secs;
  }

  setCurrentTime() {
    if (this.player.currentTime < this.player.duration) {
      this.shadowRoot.querySelector("#duration").innerHTML =
        this.formatTimer(this.player.currentTime) +
        " / " +
        this.formatTimer(this.player.duration);
    }
  }

  drawAnimation() {
    requestAnimationFrame(this.drawAnimation.bind(this));

    // update write current time
    this.setCurrentTime(this.player.currentTime);
  }
  // API de mon composant
  play() {
    if (startButtonState === undefined) {
      startButtonState = false;
      this.audioContext.resume();

      this.player.play();
      this.setCurrentTime();
      console.log(switchVideo);
    }
    startButtonState = !startButtonState;
    this.player.playbackRate = 1;
    this.changePlayButton(startButtonState);
  }

  avance10() {
    this.player.currentTime += 10;
  }

  recule10() {
    this.player.currentTime -= 10;
  }

  load() {
    this.player.load();
  }

  mute() {
    if (timesClicked % 2 == 0) {
      this.player.muted = true;
    } else {
      this.player.muted = false;
    }
  }

  changeVideo() {
    this.newVideo = this.shadowRoot.querySelector("#videoSrc").value;
    this.player = this.shadowRoot.querySelector("#player");
    this.player.src = this.newVideo;
    if (!this.newVideo.includes("mp4")) {
      alert(
        "Entrez un lien .mp4 SVP :  Exemple : https://mainline.i3s.unice.fr/mooc/elephants-dream-medium.mp4"
      );
      this.player.src = this.getAttribute("src");
    }
  }

  nextVideo() {
    if (switchVideo === videos.length - 1) {
      this.shadowRoot.querySelector("#next").disabled = true;
    } else {
      this.player.src = videos[switchVideo];
      this.shadowRoot.querySelector("#previous").disabled = false;
      switchVideo++;
    }
  }

  previousVideo() {
    if (switchVideo === 1) {
      this.shadowRoot.querySelector("#previous").disabled = true;
      this.player.src =
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    } else {
      this.player.src = videos[switchVideo];
      this.shadowRoot.querySelector("#next").disabled = false;
      switchVideo--;
    }
  }
}

customElements.define("my-player", MyVideoPlayer);
