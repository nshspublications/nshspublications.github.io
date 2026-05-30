class WakeLock {
  static wakeLockObject = null;
  static requestWakeLock = async () => {
    try {
      WakeLock.wakeLockObject = await navigator.wakeLock.request('screen');
      Console.write('[wakelock.js] Wake Lock is active!\n');
    } catch (err) {
      // The request can fail if the device is in low-power mode 
      // or if the window is not visible.
      console.error(`${err.name}, ${err.message}`);
      Console.write(""+'ERROR: '+`${err.name}, ${err.message}`+"\n");
    }
  };
  static ReleaseWakeLock(){
    if (WakeLock.wakeLockObject) {
      WakeLock.wakeLockObject.release().then(() => {
        WakeLock.wakeLockObject = null;
      });
    }
  }
}

Console.write("[wakelock.js] reached\n");

WakeLock.requestWakeLock(); //needs to happen once to initialize WakeLock.wakeLockObject

document.addEventListener('visibilitychange', async () => {
  Console.write("[wakelock.js] visibilitychange triggered\n");
  if (WakeLock.wakeLockObject !== null && document.visibilityState === 'visible') {
    Console.write("[wakelock.js] visibilityState: visible\n");
    await WakeLock.requestWakeLock();
  }
});

document.addEventListener('click', async () => {
  Console.write("[wakelock.js] click triggered\n");
  if (WakeLock.wakeLockObject !== null && document.visibilityState === 'visible') {
    Console.write("[wakelock.js] visibilityState: visible\n");
    await WakeLock.requestWakeLock();
  }
});