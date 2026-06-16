//Basic Input/Output Shell

class BasicPrograms { //helper positioning

}

class BIOS {
    static Frame = class {
        // static LINK = BootStrap.FrameUIServer;
        // static METHOD = "frame";
        // static BUFFER = [0,"\t\n",[null,-255,BIOS.Frame.SUBBUFFER]];
        // static SUBBUFFER = [];
        static LINK;
        static METHOD;
        static BUFFER;
        static SUBBUFFER;
    }
    static Boot = class {

    }
    static Kernel = class {

    }
    static Keyboard = class {
        static ClearBuffer(){
            Calipers2.Keyboard.keybuffer = [];
        }
        static FlushKeybufferArray(){
            let out = [...Calipers2.Keyboard.keybuffer];
            Calipers2.Keyboard.keybuffer = [];
            return out;
        }
    }
    static Mouse = class {
        
    }
    static Teletype = class {
        static Cursor = class {

        }
        static Color = class {

        }
        static Quick = class {
            static Print(s){
                Teletype.out_sw(['',s,'']);
            }
            static MoveCur(n){ //
                //Teletype.set_curoff(Teletype.curoff-n);
            }
            static SetCur(n){
                Teletype.set_curoff(n);
            }
        }
    }
    static Graphics = class {
        
    }
    static Storage = class {

    }
    static Interrupter = class {
        static Router = class {
            
        }
    }
    static INT;
    static Print;
    static SIGNAL_COOLDOWN = 0;
    static SIGNAL(c){
        console.warn("SIGNAL:"+c+"\n");
        if(this.SIGNAL_COOLDOWN===0){BIOS.Print("\n dbg . SIGNAL("+c+")\n");this.SIGNAL_COOLDOWN = 1;}
    }
}

BIOS.INT = BIOS.Interrupter.Router;

BIOS.Print = BIOS.Teletype.Quick.Print;

class BootStrap {
    static BootOption = 0; //bootstrap
    static Router = null; //null --> default to 0
    static Registration = class {
        static ExtShell = class { //Extensible Shell Wrapper
            constructor(name, link, mainmethod, methods, suppresslisting, description = "\0No description available.\n"){ //create, then add. 
                this.name = name;
                this.meid = BootStrap.Registration.Store.length;
                this.link = link;
                this.main = mainmethod;
                this.show = !suppresslisting;//listing
                this.desc = description;
                this.methods = methods;
            }
            in(method, data){
                if(!this.methods.includes(method)){
                    throw this.link[method](data);
                }else{
                    return this.link[method](data);
                }
                return "Unknown error [in]\n";
            }
            out(method, data){
                if(!this.methods.includes(method)){
                    throw this.link[method](data);
                }else{
                    return this.link[method](data);
                }
                return "Unknown error [out]\n";
            }
            listing(select = ""){
                return select+this.name+"\n"+(this.desc.split("\0").join(""));
            }
            listing_short(select = ""){
                return select+this.name+"\n"+(this.desc.split("\0")[0]);
            }
        }
        static Store = [
            //
        ];
        static Register(blajaio){
            if(blajaio.meid === this.Store.length){
                this.Store.push(blajaio);
                return 0;
            }
            
            return 1; //Unknown Error
        }
    }
    static FrameUIServer = class {
        static timeawait = null; //automatic selection
        static selection = -1;
        static listbuffer = [0, "\t\n", null];
        static init(){
            //reinit
            this.timeawait = null; //automatic selection
            this.selection = -1;

            BIOS.Frame.LINK = BootStrap.FrameUIServer;
            BIOS.Frame.METHOD = "frame";
            BIOS.Frame.BUFFER = [0,"\t\n",[null,-255,BIOS.Frame.SUBBUFFER]];
            BIOS.Frame.SUBBUFFER = [];

            k_framemgr.SetMethod((b)=>{
                BIOS.Frame.SUBBUFFER = b;
                BIOS.Frame.LINK[BIOS.Frame.METHOD](BIOS.Frame.BUFFER);
            });
        }
        static frame([subbuffer, mode]){
            //default to first non-hidden option (restart)
            if(this.selection === -1){
                //find first non-restricted selection
                this.selection = 2; //debug default
                this.timeawait = Date.now() + (1000*15); //15 seconds

                BIOS.Print("\n{click anywhere on screen for PromptInput Keyboard Debug Utility access}\n*** [iclOS . iCLOpS UReE BootStrap ] CrashBoot BootStrapper BI/OShell Utility v1.0x ***\n\n\n\tSelect boot option from: \n\n");
                this.listbuffer[2] = [-1, this.selection];
                this.list(this.listbuffer);
            }
            let kb = BIOS.Keyboard.FlushKeybufferArray();
            let autostart = false;
            for(let i=0;i<kb.length;i++){
                this.timeawait = null;
                switch(kb[i]){
                    case "ArrowUp":
                        this.selection = (this.selection-1 + BootStrap.Registration.Store.length)%BootStrap.Registration.Store.length;
                        break;
                    case "ArrowDown":
                        this.selection = (this.selection+1)%BootStrap.Registration.Store.length;
                        break;
                    case "\n": //PromptInput
                        autostart=true;
                        break;
                    case "Enter": //Keyboard
                        autostart=true;
                        break;
                    default:
                        if(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(kb[i])){
                            this.selection = JSON.parse(kb[i])%BootStrap.Registration.Store.length;
                        }else if(kb[i] === "+" || kb[i] === "="){
                            this.selection = (this.selection+1)%BootStrap.Registration.Store.length;
                        }else if(kb[i] === "_" || kb[i] === "-"){
                            this.selection = (this.selection-1 + BootStrap.Registration.Store.length)%BootStrap.Registration.Store.length;
                        }else{
                            let x;
                            try{
                                x = JSON.parse(kb[i]);
                            }catch(e){
                                x = this.selection;
                            }
                            this.selection = x % BootStrap.Registration.Store.length;
                            // console.log(kb[i]);
                            // //let x = this.selection;
                            // try{
                            //     //x = parseInt(kb[i]);
                            //     this.selection = parseInt(kb[i])%BootStrap.Registration.Store.length;
                            //     console.log(this.selection);
                            // }catch(e){
                            //     console.warn(e.msg);
                            // }
                        }
                }
            }
            let append = "";
            
            if(this.timeawait !== null && this.timeawait !== 0 && this.timeawait !== -1){
                append = "(will automatically boot in "+Math.floor((this.timeawait - Date.now())/1000)+" seconds) ";
                if(this.timeawait - Date.now() <= 0){
                    append = "Booting... "
                    autostart = true;
                }
            }
            Teletype.set_post(" [Press Enter to open] Selection: "+this.selection+" ["+BootStrap.Registration.Store[this.selection].name+"] \u2195 "+append);
            if(autostart){
                BIOS.Print("Booting from entry "+this.selection+"\n");
                BootStrap.BootOption = this.selection;
                BootStrap.router = this.selection;
                BIOS.Frame.METHOD = BootStrap.Registration.Store[BootStrap.BootOption].main;
                BIOS.Frame.LINK = BootStrap.Registration.Store[BootStrap.BootOption].link;
                //console.log(BootStrap.Registration.Store[BootStrap.BootOption].link);
                BIOS.Frame.BUFFER = [];//
                BIOS.Frame.SUBBUFFER = [];
            }
        }
        static list([modeid = 0, s = "\n", subbuffer = null]){
            let buffer = [modeid, s, subbuffer];
            console.warn(buffer);
            //console.log(subbuffer)
            //subbuffer options : [modifiedmode, selector]
            //modifiedmode entries: {0: show hidden listings, }
            let selector = -1;
            let showhidden = false;
            if(subbuffer !== null){
                //modifiedmode
                if(subbuffer.length !== 0){
                    if(subbuffer[0]===0){showhidden=true;}
                    
                }
                //if(subbuffer[1])
                //selector
                if(subbuffer.length >= 2){
                    //if(typeof subbuffer[1] === "string"){selector = subbuffer[1];}
                    selector = subbuffer[1];
                }
            }
            //access Store, print with BIOS
            //[0,s] - list
            //[1,s] - list_short
            let out = "";
            for(let i=0;i<BootStrap.Registration.Store.length;i++){
                if(!showhidden && BootStrap.Registration.Store[i].show === false){
                    continue;
                }else if(BootStrap.Registration.Store[i].show === false || BootStrap.Registration.Store[i].desc.includes("\0")){
                    out+="."; //restriction notifier
                }
                if(i === selector){
                    out += "*"
                }
                out+="["+i+"] ";
                switch(modeid){
                    case 0:
                        out+=BootStrap.Registration.Store[i].name;
                        out+=s+((BootStrap.Registration.Store[i].desc).split("\0").join(""));
                        out+="\n";//
                        break;
                    case 1:
                        out+=BootStrap.Registration.Store[i].name;
                        out+=s+((BootStrap.Registration.Store[i].desc).split("\0")[0]);
                        out+="\n";//
                        break;
                    default:
                        return "[BootStrap.FrameUIServer.list([ERROR, s, subbuffer])] Serious Unknown Error with buffer:"+JSON.stringify([modeid, s, subbuffer])+"\n";
                }
            }
            //return out; //debug
            BIOS.Teletype.Quick.Print(out); //debug
        }
        static RestartSubroutine = class { //restartxs
            static reboot(){
                //
                BIOS.Print("Rebooting... \n")
                BootStrap.FrameUIServer.init();
            }
        }
    }
}

class BS_DTcoiPadt {
    static FrameServer = class {
        static frame(){
            BIOS.Print("f");
        }
    }
}

BootStrap.Registration.Register(
    new BootStrap.Registration.ExtShell(
        "bootstrap",
        BootStrap.FrameUIServer,
        "frame",
        ["frame",
            "list",
            "init",] ,
        false, //whether it should be hidden -- surpress
        "\0BootStrap--Do not enter, may cause error state.\n"// "X"//no
    )
);

BootStrap.Registration.Register( //debug
    new BootStrap.Registration.ExtShell(
        "testnull",
        BootStrap.FrameUIServer,
        "frame",
        ["frame",
            "list",] ,
        true, //
        "Null test listing -- DO NOT ENTER.\n"// "X"//no
    )
);

BootStrap.Registration.Register(
    new BootStrap.Registration.ExtShell(
        "restartxs",
        BootStrap.FrameUIServer.RestartSubroutine,
        "reboot",
        ["reboot",
            //"list"
        ,] ,
        false, //
        "Reboot system (automatic/default option).\n"// "X"//no
    )
);

BootStrap.Registration.Register( //debug
    new BootStrap.Registration.ExtShell(
        "testnull2",
        BootStrap.FrameUIServer,
        "frame",
        ["frame",
            "list",] ,
        false, //
        "Null test listing for display debugging -- DO NOT ENTER.\n"// "X"//no
    )
);

BootStrap.Registration.Register( //debug
    new BootStrap.Registration.ExtShell(
        "choi",
        BS_DTcoiPadt.FrameServer,
        "frame",
        ["frame",] ,
        false, //
        "\0choi tcoi.\n"// "X"//no
    )
);

//k_framemgr.SetMethod();

//k_framemgr.SetMethod((b)=>BootStrap.FrameUIServer.frame([0,"\t\n",[null,b]]))