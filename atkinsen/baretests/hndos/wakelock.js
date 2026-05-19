class WakeLock {
  static wakeLockObject = null;
  static requestWakeLock = async () => {
    try {
      WakeLock.wakeLockObject = await navigator.wakeLock.request('screen');
      Console.write('\nWake Lock is active!\n');
    } catch (err) {
      // The request can fail if the device is in low-power mode 
      // or if the window is not visible.
      console.error(`${err.name}, ${err.message}`);
      Console.write("\n"+'ERROR: '+`${err.name}, ${err.message}`+"\n");
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

Console.write("wakelock.js reached\n");

document.addEventListener('visibilitychange', async () => {
  if (WakeLock.wakeLockObject !== null && document.visibilityState === 'visible') {
    await WakeLock.requestWakeLock();
  }
});