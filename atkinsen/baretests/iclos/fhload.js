//Search Parameters (URLSearchParams)
//(Desktop) File Handling API
//(Mobile) Web Share Target API
//(In App) File System Access API

console.log("Reached fhload.js"); //debug

class SystemInputBuffer {
    static AddressParameters = class {
        static InputArray = []; //key-value derivative
        static Populate(){
            SystemInputBuffer.AddressParameters.InputArray = Array.from((new URLSearchParams(window.location.search)).entries()); //don't really want to waste memory.
        }
    }
}

//Search Parameters (URLSearchParams)
SystemInputBuffer.AddressParameters.Populate();
//SystemInputBuffer.AddressParameters.InputArray = Array.from((new URLSearchParams(window.location.search)).entries()); //don't really want to waste memory.
// const queryString = window.location.search;
// console.log(queryString);
// const urlParams = new URLSearchParams(queryString);
//console.log(Array.from(urlParams.entries()));
/*if(urlParams.size>0){for(let i in urlParams.getAll()){
    console.log(i);
}}*/

//File Handling API
if ('launchQueue' in window) {
  launchQueue.setConsumer(async (launchParams) => {
    if (launchParams.files.length > 0) {
      for (const fileHandle of launchParams.files) {
        const file = await fileHandle.getFile();
        // Read or render the file here
        
      }
    }
  });
}