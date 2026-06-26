BIOS.Teletype.Quick.Print("iclOS CrashBoot\nCoreOS Research Group / Atkinsen Institute / A&C QDOS Project\n   H A C K E R S  N E T W O R K Associated.\n");

if ("serviceWorker" in navigator) {
  BIOS.Print("[sw] Registering sw...\n");
  navigator.serviceWorker.register("service-worker.js").then(
    (registration) => {
      BIOS.Teletype.Quick.Print("[sw] Service worker registration successful : "+JSON.stringify(registration)+"\n");
      console.log("Service worker registration successful:", registration);
    },
    (error) => {
      BIOS.Teletype.Quick.Print("[sw] Service worker registration failed : "+JSON.stringify(error)+"\n");
      console.error(`Service worker registration failed: ${error}`);
    },
  );
} else {
  console.error("Service workers are not supported.");
  BIOS.Teletype.Quick.Print("[sw] Service workers are not supported . "+JSON.stringify(navigator)+"\n");
}

Teletype.set_curoff(0);

/*setInterval(()=>{
    //
    Console.clear();
    Console.write("; Wake Lock status: "+JSON.stringify(WakeLock.wakeLockObject)+"\n"
    +"");
    Teletype.set_post("HNet QDOS\n"+Console.Streams.Short);
},1000/15);*/

/*JobManager.Jobs.push(
  new JobManager.Job(
    'frame',
    new Executable.Program(
      class {
        static frame(){
          dbg_program.frame();
        }
      },
      'frame'
    )
  )
);*/
/*JobManager.call(JobManager.create(
  new JobManager.Job(
    'frame',
    new Executable.Program(
      class {
        static frame(){
          dbg_program.frame();
        }
      },
      'frame'
    )
  )
));*/

BIOS.Print("Initializing k_framemgr\n");

//k_framemgr{}
k_framemgr.call = (b) => {
  //console.log(Calipers2.Keyboard.keybuffer);
  BIOS.Keyboard.ClearBuffer();
  return 1+b.length
};

k_framemgr.lastcalltime = Date.now();

BIOS.Print("[k_framemgr] : "
  +k_framemgr.lastcalltime+"  "+
  "[Main]:"+k_framemgr.call
  +"\n"
);

//Teletype.set_font("Terminus");
//Teletype.curchar = "_";

/*setInterval(()=>{
  dbg_program.frame();
},1000/60);*/

//k_framemgr.rafret = requestAnimationFrame(k_framemgr.frame);

/*document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    k_framemgr.isRunning = false;
    cancelAnimationFrame(animationFrameId);
  } else {
    k_framemgr.isRunning = true;
    k_framemgr.rafret = Calipers2.setframecall(k_framemgr.frame);
  }
});*/

k_framemgr.rafret = Calipers2.setframecall(k_framemgr.frame);

BIOS.Print("k_framemgr.rafret = "+k_framemgr.rafret+"\n");

Teletype.curchar = "\u2593";
//Teletype.clear();
Teletype.set_post("");
Teletype.refresh();

//k_framemgr.SetMethod((b)=>BootStrap.FrameUIServer.frame([0,"\t\n",[null,b]]));

// BIOS.Frame.LINK = BootStrap.FrameUIServer;
// BIOS.Frame.METHOD = "frame";
// BIOS.Frame.BUFFER = [0,"\t\n",[null,-255,BIOS.Frame.SUBBUFFER]];
// BIOS.Frame.SUBBUFFER = [];

// k_framemgr.SetMethod((b)=>{
//   BIOS.Frame.SUBBUFFER = b;
//   BIOS.Frame.LINK[BIOS.Frame.METHOD](BIOS.Frame.BUFFER);
// });

async function reach_FDM() {
  const { FDM } = await import('./fdm.js');
  return FDM;
}

//let FDM = reach_FDM();
console.log(FDM.reach_test());

BootStrap.FrameUIServer.init();