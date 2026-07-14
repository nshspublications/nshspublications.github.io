class k_framemgr {
  static rafret;
  static lastcalltime = 0;
  static BestFramerateApprox = 0;
  //static SIGINT = false;
  static call = (b) => {
    //console.log(Calipers2.Keyboard.keybuffer);
    //BIOS.Keyboard.ClearBuffer();
    //return 1+b.length
  }; //the call
  static frame(){
    if(Keyboard.keysdown["Control"] || Keyboard.keysdown["Meta"]){
      //console.log("C")
      if(Keyboard.keybuffer.includes("C") || Keyboard.keybuffer.includes("c")){
        //SIGINT
        DebugIO.SIGNAL(1);
      }else if(BIOS.SIGNAL_COOLDOWN===1){
        BIOS.SIGNAL_COOLDOWN=0;
      }
    }
    k_framemgr.BestFramerateApprox = 1000/(Date.now() - k_framemgr.lastcalltime);
    //dbg_program.frame();//dbg
    // JobManager.frame();
    k_framemgr.call([]);

    k_framemgr.lastcalltime=Date.now();
  }
  static SetMethod(newcallback){
    return (this.call = newcallback) === newcallback;
  }
}