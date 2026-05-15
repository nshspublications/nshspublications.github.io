let wakeLock = null;

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    dbg_cout('\nWake Lock is active!\n');
  } catch (err) {
    // The request can fail if the device is in low-power mode 
    // or if the window is not visible.
    console.error(`${err.name}, ${err.message}`);
    dbg_cout("\n"+'ERROR: '+`${err.name}, ${err.message}`+"\n");
  }
};

document.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
});

function ReleaseWakeLock(){
    if (wakeLock) {
  wakeLock.release().then(() => {
    wakeLock = null;
  });
}
}
