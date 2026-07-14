let gpdbbs_reader;
{

    let tty_pre = "\n", tty = "", tty_post = "";

    function cout(s){

    }

    class LoginManager {
        static username = "guest";
    }

    class RoomContext {
        static room = "";
    }

    class NetResc {
        static gCacheString = "";

    }

    class Frame {
        static mode = "login";
    }

    class TTYCompositor {

    }

    class DataTools {
        static tsvstr_to_2darr(s){
            var out = [];
            var p = s.split("\r\n");
            for(var i=0;i<p.length;i++){
                out.push(p[i].split("\t"));
            }
            return out;
        }
        static uint8arr_to_str(ua){
            var out = "";
            for(var i=0;i<ua.length;i++){
                out += String.fromCharCode(ua[i]);
            }
            return out;
        }
        static aliasmatch(un,al){
            for(var i=0;i<al.length;i++){
                if(un === al[i][0]){
                    return al[i][1];
                }
            }
            return un;
        }
    }

    class NetTools {
        static async submitForm(data){
            console.log("ERROR_SORRY");return "ERROR_SORRY";
            //https://docs.google.com/forms/d/e/1FAIpQLSfLDaYTC59eQYYrqwFUe3DzGO67NbR9J-JLyRWjlqSmsCcZDA/viewform?usp=pp_url&entry.736993216=EMAIL+ADDR&entry.2089575475=MSG+FIELD&entry.972830120=(Do+not+select+if+you+do+not+know+what+this+does)+Post+As+Raw+Command
            //fetch("https://docs.google.com/forms/d/e/1FAIpQLSfLDaYTC59eQYYrqwFUe3DzGO67NbR9J-JLyRWjlqSmsCcZDA/formResponse?usp=pp_url&entry.736993216=EMAIL+ADDR3&entry.2089575475=MSG+FIELD&entry.972830120=(Do+not+select+if+you+do+not+know+what+this+does)+Post+As+Raw+Command",{method:'GET',mode:'no-cors'})
            //https://docs.google.com/forms/d/e/1FAIpQLSfLDaYTC59eQYYrqwFUe3DzGO67NbR9J-JLyRWjlqSmsCcZDA/formResponse?entry.736993216=mailer&entry.2089575475=Message+Test+From+AUTOMAN%21&entry.972830120=x
            const formId = '1FAIpQLSfLDaYTC59eQYYrqwFUe3DzGO67NbR9J-JLyRWjlqSmsCcZDA';
            const baseUrl = 'https://docs.google.com/forms/d/e/'+formId+'/formResponse';
            const formData = new URLSearchParams();
            for(const key in data){
                formData.append(key, data[key]);
            }
            const url = baseUrl + '?usp=pp_url&' + formData.toString();
            //cout(url+"\n");
            //alert(url);
            try{
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'no-cors' //might be impossible
                });
                if(response.status === 200){
                    console.log("Successful Submit");
                    //cout("Successful Submit\n");
                }else{
                    console.error("Submit Error",response.status);
                    //cout("Unsuccessful Submit: "+response.status+"\n");
                }
            }catch(error){
                console.error("Submit Error",response.status);
            }
        }
        static postCommand(un,cmd,israw){
            var rv = '(Do not select if you do not know what this does) Post As Raw Command';
            if(israw){
                const fd = {'entry.736993216':un,'entry.2089575475': cmd,'entry.972830120':rv};
                this.submitForm(fd);
            }else{
                //rv = "";
                const fd = {'entry.736993216':un,'entry.2089575475': cmd};
                this.submitForm(fd);
            }
        }
        static async updateDB(){
            //https://docs.google.com/spreadsheets/d/e/2PACX-1vRY_GjB--qooB76G3R6aOrK2W6QjANBc9zqlIpvUbeM9na7Sj03yuHkyu0I-tbhvKWvNrDtPyKzknRK/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false
            /*try{
                const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRY_GjB--qooB76G3R6aOrK2W6QjANBc9zqlIpvUbeM9na7Sj03yuHkyu0I-tbhvKWvNrDtPyKzknRK/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false",{method:'GET',mode:'no-cors'});
                if(!response.ok){
                    cout("PROTO ERROR: "+response.status+"\n");
                }
                const json = await response.text();
                cout("JSON RESPONSE: "+json+"\n");
            }catch(error){
                cout("PROTO ERROR: "+error.message+"\n");
            }*/
            udb_status = "Attempting fetch...\n";
            try {
                
            //read .csv file on a server
            const target = `https://docs.google.com/spreadsheets/d/1nWyVU75Sje7pKYODCLU7zIF7hoqGRJ5_xjGbTrcfGrw/export?format=tsv&gid=0#gid=0`;

            const res = await fetch(target, {
                method: 'get',
                headers: {
                    'content-type': 'text/tsv;charset=UTF-16',
                }
            });
            udb_status = "Checking response...\n";
            if (res.status === 200) {
                udb_status = "Retrieving response content...\n";
                const data = await res.text();
                gres = data;
                gchange = true;
                last_fetch = (new Date).toString();
                udb_status = "Fetched.\n";
                //console.log(data);
                //cout(data+"\n");
            } else {
                    console.log(`Error code ${res.status}`);
                    cout("Error: "+res.status+"\n");
                    udb_status = "Error, retrying...\n";
                    gchange=true;
                }
            } catch (err) {
                console.log(err);
                udb_status = "Error, retrying...\n";
                gchange = true;
            }
        }
        static getfeed(rm){ //requires: gres, notif, belli, 
            //cout("getfeed()\n");//debug
            let out = "";
            let dtp = tsvstr_to_2darr(gres)[0][0].split("\u0000");
            //console.log(dtp);

            let al = []; //[un,name]
            let posts = []; //[un,str,i]
            let del = []; //[un,post(i)]
            let i,j;
            for(i=0;i<dtp.length;i++){
                //un:post #room str
                //un:name str
                let cmd = breakcmd(dtp[i]);
                if(cmd.length < 2){
                    continue;
                }else if(cmd[1] === "post"){
                    if(cmd.length<4){continue;}
                    if(JSON.parse(cmd[2]) === rm){
                        posts.push([cmd[0],JSON.parse(cmd[3]),i]); //we have i here for delete functionality
                        if(cmd.length >= 5){
                            
                            posts[posts.length-1].push(JSON.parse(cmd[4]));
                        }
                    }
                }else if(cmd[1] === "name"){
                    if(cmd.length!==3){continue;}
                    //DOES expect string formatting
                    let stopgm = true;
                    for(j=0;j<al.length;j++){
                        if(al[j][0]===cmd[0]){
                            al[j][1]=JSON.parse(cmd[2]);
                            stopgm=false;
                            break;
                        }   
                    }
                    if(stopgm){
                        al.push([cmd[0],JSON.parse(cmd[2])]);
                    }
                    //console.log(al);
                }else if(cmd[1] === "delete"){
                    if(cmd.length!==3){continue;}
                    //this is a delete REQUEST. cmd[0] of post needs to match cmd[0] of delete
                    del.push([cmd[0],JSON.parse(cmd[2])]);
                }
            }
            //curgresi = dtp.length-1;
            //if(curgresi === undefined){
                //console.log(posts[posts.length-1]);
            //}
            if(posts.length !== 0){curgresi = posts[posts.length-1][2];} //I guess this is where the error is???
            x: for(i=0;i<posts.length;i++){ //addlineprefix?
                for(j=0;j<del.length;j++){
                    if(del[j][0] === posts[i][0] && del[j][1] === posts[i][2]){
                        continue x;
                    }
                }
                if(addlineprefix){
                    out += "(" + posts[i][2] + ") ";
                }
                if(showposttimestamp && posts[i].length >= 4){
                    out += "["+posts[i][3]+"] ";
                }
                if(notif && posts[i][2] > belli){
                    out+= "\u237E ";
                }
                out += DataTools.aliasmatch(posts[i][0],al) + ": " + posts[i][1] + "\n";
            }

            return out;
        }
    }

    class GPRoutines {
        static processcmd(s){
            let cmd = breakcmd_notag(s);
            let b;
            let i,j,k;
            let dtp;
            let oa,os,c;
            if(cmd.length === 0){
                return;
            }
            switch(cmd[0]){
                case "":
                    return; 
                break;//
                case "cls":
                    tty_pre = "";
                break;
                case "clr":
                    tty_pre = "";
                break;
                case "clear":
                    tty_pre = "";
                break;
                case "mgr":
                    if(cmd.length === 1){
                        cout("[mgr] No input specified.\n");
                        return;
                    }
                    switch(cmd[1]){
                        case "list":
                            if(cmd.length === 2){
                                cout("[mgr] List options: raw room user name\n");
                                return;
                            }
                            dtp = tsvstr_to_2darr(gres)[0][0].split("\u0000");
                            let grep = ["",0]; //[cmd1check (-1 means any),cmdret (-1 means line)]
                            switch(cmd[2]){
                                case "room":
                                    grep = ["post",2];
                                break;
                                case "user":
                                    grep = [-1,0];
                                break;
                                case "name":
                                    grep = ["name",-1];
                                break;
                                case "raw":
                                    cout(dtp.join("\n")+"\n");
                                    return;
                                default:
                                    cout("[mgr] "+cmd[2]+" not recognized as list.\n");
                                    return;
                            }
                            oa = [];
                            for(i=0;i<dtp.length;i++){
                                b = breakcmd(dtp[i]);
                                if(b.length < 2){
                                    continue; //just doesn't count.
                                }
                                if(grep[0] === -1 || b[1] === grep[0]){
                                    k = true;
                                    for(j=0;j<oa.length;j++){
                                        if(grep[1] === -1){
                                            //k=false;
                                            break;
                                        }else if(oa[j] === b[grep[1]]){
                                            k=false;
                                            break;
                                        }
                                    }
                                    if(k){
                                        if(grep[1] === -1){
                                            oa.push(dtp[i]);
                                        }else{
                                            oa.push(b[grep[1]]);
                                        }
                                    }
                                }
                            }
                            cout(oa.join("\n")+"\n");

                            return;
                        break;
                    }
                break;
                case "help":
                    if(cmd.length === 1){return;}
                    switch(cmd[1]){
                        case "more":
                            cout("help [command]: get specific help message for command\nhelp more: display long help message\ncls / clr / clear: clear console output\nhidetext: display string used by hide (called hidetxt)\nhidetext [string]: set hidetxt string (JSON-formatted string)\nmgr: management tool\nhidestring: display string (called hidechar, defaults to newline delimiter) that hide waits for to be typed in order to close\nhidestring [string]: set hidechar string (JSON-formatted string)\n");
                            return;
                        break;
                    }
                break;
                case "hidetext":
                    if(cmd.length === 1){
                        cout("Current hide text:\n"+hidetxt+"\n");
                    }else{
                        hidetxt = JSON.parse(cmd[1]);
                    }
                break;
                case "hidestring":
                    if(cmd.length === 1){
                        cout("Current hide string: "+JSON.stringify(hidechar)+"\n");
                    }else{
                        hidechar = JSON.parse(cmd[1]);
                    }
                break;
                case "cache":
                    //save client settings for user
                    cache_cli_settings_w_srv();
                break;
                case "decache":
                    //unsave client settings for user
                    decache_cli_settings_w_srv();
                break;
                case "tickrate":
                    if(cmd.length!==2){
                        cout("Insufficient arguments.\n");
                        return;
                    }
                    tr = JSON.parse(cmd[1]);
                break;
                case "apply-cache":
                    cacheinit();
                    applyCacheStore();
                break;
                case "eval":
                    for(i=1;i<cmd.length;i++){
                        try{eval(JSON.parse(cmd[i]));}catch(error){cout("From eval: "+error.message+"\n");}
                    }
                break;
                case "evalecho":
                    for(i=1;i<cmd.length;i++){
                        try{cout(""+eval(JSON.parse(cmd[i]))+"\n");}catch(error){cout("From evalecho: "+error.message+"\n");}
                    }
                break;
                default:
                    cout("'"+cmd[0]+"' is not recognized as a valid command.\n");
            }
        }
    }

    gpdbbs_reader = class GPDBBS_Reader {
        static frame(){
            //
            BIOS.Print("[gpdbbs] This system not ready for use. -- Please use legacy version.\n");
            BootStrap.FrameUIServer.RestartSubroutine.reboot();
        }
        static beginpoll(){
            this.ready = false;
            FDM.NetworkCallStack.DispatchJob([
                "fetch_get_text",
                this.readlanding,
                (i, b) => {
                    if(b.type === "Error"){
                        console.log("Net Method Error:", b, i);
                        return;
                    }
                    let proc=false;
                    if(gpdbbs_reader.file !== b.value){proc=true;}
                    gpdbbs_reader.file=b.value;
                    gpdbbs_reader.ready=true;
                    if(proc){
                        gpdbbs_reader.await_process_file = true;
                    }
                },
                true
            ]);
        }
        static process_file(){
            this.processed_file = this.file.split("\0");
        }
    }
    BasicPrograms["GPDBBS_Reader"] = gpdbbs_reader;
    BootStrap.Registration.Register(
        new BootStrap.Registration.ExtShell(
            "gpdbbs",
            BasicPrograms.GPDBBS_Reader,
            "frame",
            ["frame",],
            false,
            "Simple GPDBBS Reader"
        )
    );
}