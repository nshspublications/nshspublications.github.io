var COE = document.getElementById('dbgconout');
var CONALL = "";

function dbg_cout(s){
    //console.log(s);
    COE.textContent+=s;
    CONALL+=s;
}

function dbg_clearcon(){
    COE.textContent="";
}

//setInterval(()=>{dbg_cout("Test ");requestWakeLock()},500)

setInterval(()=>{
    //
    dbg_clearcon();
    dbg_cout("; Wake Lock status: "+JSON.stringify(wakeLock)+"\n"
    +"");
},1000/15);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").then(
    (registration) => {
      console.log("Service worker registration successful:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
} else {
  console.error("Service workers are not supported.");
}
