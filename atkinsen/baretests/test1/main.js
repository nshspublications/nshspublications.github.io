var COE = document.getElementById('dbgconout');

function dbg_cout(s){
    console.log(s);
    COE.textContent+=s;
}

setInterval(()=>{dbg_cout("Test ");requestWakeLock()},500)
