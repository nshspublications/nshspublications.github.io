class WakeLock {
  static wakeLockObject = null;
  static Pedantic = false;
  static requestWakeLock = async () => {
    try {
      WakeLock.wakeLockObject = await navigator.wakeLock.request('screen');
      WakeLock.hyperlog('[wakelock.js] Wake Lock is active!\n');
    } catch (err) {
      // The request can fail if the device is in low-power mode 
      // or if the window is not visible.
      console.error(`${err.name}, ${err.message}`);
      Console.write_error("\n"+'ERROR: '+`${err.name}, ${err.message}`+"\n");
    }
  };
  static ReleaseWakeLock(){
    if (WakeLock.wakeLockObject) {
      WakeLock.wakeLockObject.release().then(() => {
        WakeLock.wakeLockObject = null;
      });
    }
  }
  static hyperlog(s){
    if(this.Pedantic){
      return Console.write(s);
    }
  }
}

WakeLock.hyperlog("[wakelock.js] reached\n");

WakeLock.requestWakeLock(); //needs to happen once to initialize WakeLock.wakeLockObject

document.addEventListener('visibilitychange', async () => {
  WakeLock.hyperlog("[wakelock.js] visibilitychange triggered\n");
  if (WakeLock.wakeLockObject !== null && document.visibilityState === 'visible') {
    WakeLock.hyperlog("[wakelock.js] visibilityState: visible\n");
    await WakeLock.requestWakeLock();
  }
});

document.addEventListener('click', async () => {
  WakeLock.hyperlog("[wakelock.js] click triggered\n");
  if (WakeLock.wakeLockObject !== null && document.visibilityState === 'visible') {
    WakeLock.hyperlog("[wakelock.js] visibilityState: visible\n");
    await WakeLock.requestWakeLock();
  }
});