// let __LOCK_PAGE = true;

// let __LOCK_PAGE_TIMEOUT = Date.now();

async function initDynamicManifest() {
//   try {
    // 1. Fetch the prebuilt template
    const response = await fetch('./manifest.json');
    const manifest = await response.json();

    // 2. Determine the unpredictable current directory path
    const currentDir = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1); //have no idea what this is supposed to do differently than window.location.pathname
    // console.log('currentDir: '+currentDir);

    // 3. Modify only the required fields
    // const modfields = {
    //     overwrite: [
    //         ['start_url'],
    //         ['scope']
    //     ],
    //     prepend: [
    //         ['share_target', 'action']
    //     ],
    //     prepend_forall: [
    //         ['file_handlers', 'action']
    //     ]
    // };
    // manifest.scope = currentDir;
    // manifest.start_url = currentDir;

    let crawl = (dict, list) => {
        let obj = dict;
        try{
            for(let i=0;i<list.length;i++){
                // console.log(obj, list[i]);
                obj = obj[list[i]];
                // console.log(obj);
            }
            return obj;
        }catch(e){
            console.error(e);
            return null; //error
        }
    }

    let crawl_set = (dict, list, set) => {
        let obj = dict;
        try{
            let i;
            for(i=0;i<list.length-1;i++){
                // console.log(obj, list[i]);
                obj = obj[list[i]];
                // console.log(obj);
            }
            obj[list[i]] = set;
            return obj;
        }catch(e){
            console.error(e);
            return null; //error
        }
    }

    let prepends = [
        ['scope'],
        ['start_url'],
        ['icons', 0, 'src'],
        ['icons', 1, 'src'],
        ['file_handlers', 0, 'action'],
        ['share_target', 'action'],
        
    ];

    for(let k in prepends){
        crawl_set(manifest, prepends[k], currentDir + crawl(manifest, prepends[k]));
    }
    // console.log(manifest);

    /*for (let k in modfields.overwrite){
        crawl(manifest, k) = currentDir;
    }
    for (let k in modfields.prepend){
        crawl(manifest, k) = currentDir + manifest[k];
    }
    for (let k in modfields.prepend_forall){
        for(let l in crawl(manifest, k)){
            crawl(manifest, l) = currentDir + manifest[k];
        }
    }*/

    // 4. Convert to a Blob URL
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
    const blobURL = URL.createObjectURL(blob);

    // 5. Inject into the DOM
    //const link = document.createElement('link');
    const link = document.getElementById('dynamic-manifest');
    link.rel = 'manifest';
    link.href = blobURL;
    // document.head.appendChild(link);
    
    // 6. Register Service Worker with matching scope (WE ALREADY DO THIS.)
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/service-worker.js', { scope: currentDir });
    // }
//   } catch (error) {
//     console.error('Failed to load or modify manifest:', error);
//   }
//   __LOCK_PAGE = false;
//   console.log("Complete time: "+(Date.now() - __LOCK_PAGE_TIMEOUT));
}

await initDynamicManifest();
console.log("[dynmanifest] finished.");

/*console.log("Awaiting essential function to finish, timeout will occur in 1.9 seconds if incomplete, may require restart.");

while(__LOCK_PAGE){
    //do nothing
    if(Date.now() - __LOCK_PAGE_TIMEOUT > 1900){
        __LOCK_PAGE = false;
    }
}*/