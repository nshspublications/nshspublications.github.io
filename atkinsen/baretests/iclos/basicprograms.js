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