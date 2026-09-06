if ("serviceWorker" in navigator) {
//   BIOS.Print("[sw] Registering sw...\n");
  navigator.serviceWorker.register("service-worker.js").then(
    (registration) => {
    //   BIOS.Teletype.Quick.Print("[sw] Service worker registration successful : "+JSON.stringify(registration)+"\n");
      console.log("Service worker registration successful:", registration);
    },
    (error) => {
    //   BIOS.Teletype.Quick.Print("[sw] Service worker registration failed : "+JSON.stringify(error)+"\n");
      console.error(`Service worker registration failed: ${error}`);
    },
  );
} else {
  console.error("Service workers are not supported.");
//   BIOS.Teletype.Quick.Print("[sw] Service workers are not supported . "+JSON.stringify(navigator)+"\n");
}

var isgranted = false;
var mv = 0;
var moniter = [0];
var peak = 0;
var lastpeak = 0;
var rt = 0;
var moniter2 = [0];
var peak2 = 0;
var lastpeak2 = 0;

let audioCtx = null;
let oscillator = null;
let gainNode = null;

if ("vibrate" in navigator) {
    console.log("Vibration API is supported!");
} else {
    console.log("Vibration API is not supported on this browser.");
}

function requestMotionPermission() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
      })
      .catch(console.error);
  } else if(window.DeviceMotionEvent !== undefined) {
    // Non-iOS or older devices
    window.addEventListener('devicemotion', handleMotion, true);
  }else{
    alert("no support, window.isSecureContext: "+window.isSecureContext);
  }
}

function handleMotion(event) {
    handleRotation(event);

  const acc = event.acceleration; // or event.accelerationIncludingGravity
  
  if (!acc) {mv = 0; return;}
  isgranted = true;

  const x = acc.x; // Left/Right
  const y = acc.y; // Up/Down
  const z = acc.z; // Forward/Backward

  // Check if total movement exceeds a simple threshold
  const totalMovement = Math.sqrt(x * x + y * y + z * z);
//   if (totalMovement > 1.5) {
    // console.log("Movement detected!", totalMovement);
    mv = totalMovement;
    moniter[moniter.length-1] += mv;
    if(mv >= peak){
        peak = mv;
    }
//   }
}

function handleRotation(event){
    const rotation = event.rotationRate;
    
    const x = rotation.alpha; // Left/Right
  const y = rotation.beta; // Up/Down
  const z = rotation.gamma; // Forward/Backward

  // Check if total movement exceeds a simple threshold
  const totalMovement = Math.sqrt(x * x + y * y + z * z);

    if (rotation) {
    //   console.log(`Alpha (Z-axis): ${rotation.alpha} rad/s`);
    //   console.log(`Beta (X-axis): ${rotation.beta} rad/s`);
    //   console.log(`Gamma (Y-axis): ${rotation.gamma} rad/s`);
    rt = totalMovement;
    moniter2[moniter2.length-1] += rt;
    if(rt >= peak2){
        peak2 = rt;
    }
    }
}

window.addEventListener('click', ()=>{
    requestMotionPermission();
    if (!("vibrate" in navigator)) {
        alert( "Error: Vibration API not supported." );
        return;
    }
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    navigator.vibrate(200);
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
});

function frame(){
    Graphics.autoresize();
    if(!isgranted){
        //message
        Graphics.fill([0,255,0]);
        Graphics.text('permission not granted',[0,0]);
    }else{
        if(peak >= lastpeak){
            lastpeak = peak;
        }
        peak *= 1 - 0.125/60;
        lastpeak = 0.995*lastpeak + 0.005*peak;
        if(peak2 >= lastpeak2){
            lastpeak2 = peak2;
        }
        peak2 *= 1 - 0.125/60;
        lastpeak2 = 0.995*lastpeak2 + 0.005*peak2;
        let sc = Graphics.height*0.5/(0.9*lastpeak + 0.1*peak);
        let scb = 255/(0.9*lastpeak + 0.1*peak);
        let sc3 = 0.75/(0.9*lastpeak + 0.1*peak);
        let v = Math.max(0,moniter[moniter.length-1] - 0.01);
        let rsc = Graphics.height*0.5/(0.9*lastpeak2 + 0.1*peak2);
        let rscb = 255/(0.9*lastpeak2 + 0.1*peak2);
        let rsc3 = 0.75/(0.9*lastpeak2 + 0.1*peak2);
        let rv = Math.max(0,moniter2[moniter2.length-1] - 0.01);
        
        // gainNode.gain.setValueAtTime(sc3*v, audioCtx.currentTime);
        // Graphics.fill([scb*v,scb*(mv-0.01),scb*mv]);
        gainNode.gain.setValueAtTime(rsc3*rv, audioCtx.currentTime);
        Graphics.fill([rscb*rv,rscb*(rt-0.01),rscb*rt]);

        Graphics.background();
        Graphics.fill([0,255,0]);
        Graphics.text('mv: '+mv,[0,0]);
        Graphics.text('rt: '+mv,[0,16]);
        
        // navigator.vibrate(v*1.5);
        navigator.vibrate(rv*1.5);

        moniter.push(0*mv);
        moniter2.push(0*rt);
        let x = 0;
        
        Graphics.stroke([0,0,255]);
        for(let i=Math.max(1,moniter.length-Graphics.width);i<moniter.length;i++){
            Graphics.line([x-1,moniter[i-1]*sc],[x,moniter[i]*sc]);
            x++;
        }
        x=0;
        Graphics.stroke([255,0,0]);
        for(let i=Math.max(1,moniter2.length-Graphics.width);i<moniter2.length;i++){
            Graphics.line([x-1,moniter2[i-1]*rsc],[x,moniter2[i]*rsc]);
            x++;
        }

    }
}

Calipers2.setframecall(frame);