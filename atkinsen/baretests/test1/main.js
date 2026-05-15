let COE = document.getElementById('dbgconout');

function dbg_cout(s){
    COE.textContent+=s;
}

setInterval(()=>{dbg_cout("Test ")},500)
