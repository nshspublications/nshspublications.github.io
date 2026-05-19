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

Teletype.set_curoff(0);

/*setInterval(()=>{
    //
    Console.clear();
    Console.write("; Wake Lock status: "+JSON.stringify(WakeLock.wakeLockObject)+"\n"
    +"");
    Teletype.set_post("HNet QDOS\n"+Console.Streams.Short);
},1000/15);*/

class dbg_program {
  static ip_c = new Calipers2.PromptStream();
  static frame(){
    Graphics.autoresize();
    Graphics.fill([255/4,0,0]);
    Graphics.background();
    Graphics.stroke([0,255,255]);
    Graphics.line([0,0],[Graphics.width,Graphics.height]);
    Graphics.line([Graphics.width,0],[0,Graphics.height]);
    this.ip_c.Update();
    Teletype.set_post(this.ip_c.file);
    Teletype.set_curoff(this.ip_c.curoff);
  }
}

class dbg_terminal {
  static ip_c = new Calipers2.PromptStream();
  static frame(){

  }
}

Teletype.set_font("Terminus");
Teletype.curchar = "_";

setInterval(()=>{
  dbg_program.frame();
},1000/60);