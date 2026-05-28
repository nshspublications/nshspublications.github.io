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
JobManager.call(JobManager.create(
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
));

class k_framemgr {
  static rafret;
  static lastcalltime = 0;
  static BestFramerateApprox = 0;
  static frame(){
    k_framemgr.BestFramerateApprox = 1000/(Date.now() - k_framemgr.lastcalltime);
    //dbg_program.frame();//dbg
    JobManager.frame();

    k_framemgr.lastcalltime=Date.now();
  }
}

k_framemgr.lastcalltime = Date.now();

//Teletype.set_font("Terminus");
//Teletype.curchar = "_";

/*setInterval(()=>{
  dbg_program.frame();
},1000/60);*/

//k_framemgr.rafret = requestAnimationFrame(k_framemgr.frame);
k_framemgr.rafret = Calipers2.setframecall(k_framemgr.frame);