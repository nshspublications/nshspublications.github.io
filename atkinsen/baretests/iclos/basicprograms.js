let gsnic_viewer;
{
    //GoogleShuffleNetwork Information Center Lookup
    gsnic_viewer = class GSNICReader {
        static frame(buffer){
            BIOS.Print("gs");
        }
    }
    BasicPrograms["GSNICReader"] = gsnic_viewer;
    BootStrap.Registration.Register( //debug
        new BootStrap.Registration.ExtShell(
            "gsnic_viewer",
            BasicPrograms.GSNICReader,
            "frame",
            ["frame",] ,
            false, //
            "GSNIC Database Reader\n"// "X"//no
        )
    );
}

let sysjsprompt;
{
    //JavaScript Prompt
    sysjsprompt = class JavaScriptPromptClass {
        static last = "";
        static next = "";
        static arrowshift = false;
        static input = "";
        static cursor = 0;
        static temp = "";
        static dolong=false;
        static prexecmodules = {
            "list": (ob)=>{
                let out = [];
                for (const k in ob){
                    out.push(k);
                }
                return out;
            },
            "exit": (ob)=>{
                BootStrap.FrameUIServer.RestartSubroutine.reboot();
            },
            "modules": (ob)=>{
                return BasicPrograms.JSPrompt.prexecmodules;
            },
            "hrl": (ob)=>{
                return window.location.reload();
            },
            "srl": (ob)=>{
                BootStrap.FrameUIServer.RestartSubroutine.reboot();
            },
            "rl": (ob)=>{
                try{return eval("srl();");}catch(e){return e.msg;}
            },
            /*"": (ob)=>{

            },*/
        };
        static enableprexec = true;
        static frame(buffer){
            if(this.dolong){
                return this.longmode();
            }
            let kb = BIOS.Keyboard.FlushKeybufferArray();
            if(kb.includes("\n") || kb.includes("Enter")){
                if(this.input === "`"){
                    //enter long mode
                    this.input = "";
                    this.dolong = true;
                    this.temp = "";
                }else{
                    this.last = this.input;
                    try{
                        this.cursor=0;
                        Teletype.set_curoff(0);
                        console.log(this.input);
                        BIOS.Print("{%} "+this.input+"\n");
                        if(this.enableprexec){
                            let app = "";
                            for(const k in this.prexecmodules){
                                app += "var "+k+"="+this.prexecmodules[k]+";";
                                console.log(this.prexecmodules[k]);
                            }
                            BIOS.Print(eval(app+this.input)+"\n");
                        }else{
                            BIOS.Print(eval(this.input)+"\n");
                        }
                        this.input = "";
                    }catch(e){
                        BIOS.Print("Error("+JSON.stringify(this.input)+"): "+e.msg+"\n");
                    }
                }
            }else{
                for(let i=0;i<kb.length;i++){
                    switch(kb[i].length){
                        case 0:
                            continue;
                        case 1:
                            continue;
                        default:
                            //console.log(kb[i],this.last,this.input,this.next);//debug
                            switch(kb[i]){ //(newval x oldval)
                                case "Backspace":
                                    this.input = this.input.slice(0,this.input.length+this.cursor-1)+this.input.slice(this.input.length+this.cursor,this.input.length);
                                    this.cursor=Math.min(0,this.cursor);
                                    break;
                                case "Delete":
                                    this.input = this.input.slice(0,this.input.length+this.cursor)+this.input.slice(this.input.length+this.cursor+1,this.input.length);
                                    this.cursor=Math.min(0,this.cursor);
                                    break;
                                case "ArrowLeft":
                                    this.cursor--;
                                    this.cursor=Math.max(0-this.input.length,this.cursor);
                                    break;
                                case "ArrowRight":
                                    this.cursor=Math.min(0,++this.cursor);
                                    break;
                                case "ArrowUp":
                                    if(this.arrowshift){
                                        this.input = this.last;
                                    }else{
                                        this.next = this.input;
                                        this.input = this.last;
                                        this.arrowshift = true;
                                    }
                                    break;
                                case "ArrowDown":
                                    if(this.arrowshift){
                                        //this.next = this.input;
                                        this.input = this.next;//
                                        this.arrowshift = false;//
                                    }else{
                                        //this.next = this.input;
                                        this.input = this.next;//
                                        this.arrowshift = true;//
                                    }
                                    break;
                                default:
                            }
                            kb[i] = '';
                    }
                }
                let insert = kb.join("");
                this.input = this.input.slice(0,this.input.length+this.cursor)+insert+this.input.slice(this.input.length+this.cursor,this.input.length);
                //console.log(this.input);
                Teletype.set_post("{%} "+this.input);
                Teletype.set_curoff(this.cursor);
            }
        }
        static longmode(){
            let kb = BIOS.Keyboard.FlushKeybufferArray();
            if(kb.includes("\n") || kb.includes("Enter")){
                if(this.temp === "`"){
                    //exit long mode
                    this.dolong=false;
                    this.temp="";
                }//else{
                //     try{
                //         this.cursor=0;
                //         Teletype.set_curoff(0);
                //         console.log(this.input);
                //         BIOS.Print(" ~  "+this.input+"\n");
                //         BIOS.Print(eval(this.input)+"\n");
                //         this.input = "";
                //     }catch(e){
                //         BIOS.Print("Error("+JSON.stringify(this.input)+"): "+e.msg+"\n");
                //     }
                // }
                else{
                    //push line
                    this.input += this.temp + "\n";
                    this.temp = "";
                }
            }else{
                for(let i=0;i<kb.length;i++){
                    switch(kb[i].length){
                        case 0:
                            continue;
                        case 1:
                            continue;
                        default:
                            switch(kb[i]){ //(newval x oldval)
                                case "Backspace":
                                    this.temp = this.temp.slice(0,this.temp.length+this.cursor-1)+this.temp.slice(this.temp.length+this.cursor,this.temp.length);
                                    this.cursor=Math.min(0,this.cursor);
                                    break;
                                case "Delete":
                                    this.temp = this.temp.slice(0,this.temp.length+this.cursor)+this.temp.slice(this.temp.length+this.cursor+1,this.temp.length);
                                    this.cursor=Math.min(0,this.cursor);
                                    break;
                                case "ArrowLeft":
                                    this.cursor--;
                                    this.cursor=Math.max(0-this.temp.length,this.cursor);
                                    break;
                                case "ArrowRight":
                                    this.cursor=Math.min(0,++this.cursor);
                                    break;
                                case "ArrowUp":
                                    //skipline
                                    break;
                                case "ArrowDown":
                                    //skipline
                                    break;
                                default:
                            }
                            kb[i] = '';
                    }
                }
                let insert = kb.join("");
                this.temp = this.temp.slice(0,this.temp.length+this.cursor)+insert+this.temp.slice(this.temp.length+this.cursor,this.temp.length);
                //console.log(this.input);
                Teletype.set_post(this.input+"\n{~} "+this.temp);
                Teletype.set_curoff(this.cursor);
            }
        }
    }
    BasicPrograms["JSPrompt"] = sysjsprompt;
    BootStrap.Registration.Register(
        new BootStrap.Registration.ExtShell(
            "sysjsprompt",
            BasicPrograms.JSPrompt,
            "frame",
            ["frame",],
            false,
            "System Privilege JavaScript Evaluator Prompt\n"
        )
    )
}

let gpdbbs_reader;
{
    gpdbbs_reader = class GPDBBS_Reader {
        static ready = true;
        static file = "Please wait...";
        static processed_file = [];
        static await_process_file = true;
        static readlanding = "https://docs.google.com/spreadsheets/d/1nWyVU75Sje7pKYODCLU7zIF7hoqGRJ5_xjGbTrcfGrw/export?format=tsv&gid=0#gid=0";
        //static readlanding = "https://docs.google.com/spreadsheets/d/1nWyVU75Sje7pKYODCLU7zIF7hoqGRJ5_xjGbTrcfGrw/export?format=tsv&gid=0#gid=0";
        static frame(){
            if(this.ready){
                this.beginpoll();
            }
            if(this.await_process_file){
                this.await_process_file = false;
                this.process_file();
            }
            Teletype.set_post(this.processed_file.join("\n"));
        }
        static beginpoll(){
            this.ready = false;
            FDM.NetworkCallStack.DispatchJob([
                "fetch_get_text",
                this.readlanding,
                (i, b) => {
                    let proc=false;
                    if(gpdbbs_reader.file !== b){proc=true;}
                    gpdbbs_reader.file=b;
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
            "",
            BasicPrograms.GPDBBS_Reader,
            "frame",
            ["frame",],
            false,
            "Simple GPDBBS Reader"
        )
    );
}