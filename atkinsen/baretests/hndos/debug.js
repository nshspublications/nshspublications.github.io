class dbg_program {
  static ip_c = new Calipers2.PromptStream();
  static dbgnull = false;
  static flushsystemconsole = true;
  static frame(){
    if(!this.dbgnull){
      return dbg_cmd.frame();
    }
    if(this.flushsystemconsole && Console.Streams.Short !== ""){
        Teletype.out_sw(["","\n[Console] "+Console.Streams.Short+"\n",""]);
        Console.clear();
    }
    Graphics.autoresize();
    Graphics.fill([255/4,0,0]);
    Graphics.background();
    Graphics.stroke([0,255,255]);
    Graphics.line([0,0],[Graphics.width,Graphics.height]);
    Graphics.line([Graphics.width,0],[0,Graphics.height]);
    this.ip_c.Update();
    Teletype.set_post(this.ip_c.file);
    Teletype.set_curoff(this.ip_c.curoff);
  }
}

class dbg_cmd {
  static ip_c = new Calipers2.PromptStream();
  static ALLOWALIASLOOP = false;
  static protect_clickerdisable = true;
  static Command = class {
    constructor(name, callback){
      this.name = name;
      this.callback = callback;
    }
    main(parameters){
      return this.callback(parameters);
    }
  }
  static Alias = class {
    constructor(from, to){
      this.from = from;
      this.to = to;
    }
  }
  static cmdreg = {
    dt: new this.Command("dt", (params)=>{
      return "Debug test; parameters:\n"+JSON.stringify(params)+"\n";
    }),
    help: new this.Command("help", (params)=>{
      //debug message dbg
      return "Help command not yet implemented.\n";
    }),
    lscr: new this.Command("lscr", (params)=>{
      //return JSON.stringify(this.cmdreg)+"\n";
      let out = "";
      let verbose = params.includes("-v") || params.includes("--verbose") || params.includes("v");
      out += "Commands:\n";
      for(const k in this.cmdreg){
        out += this.cmdreg[k].name;
        //console.log(this.cmdreg[k].callback);
        if(verbose){
          out+="\n"+(this.cmdreg[k].callback.toString());
        }
        out+="\n";
      }
      out += "Aliases:\n[k]\t\tfrom\t\tto\n";
      for(const k in this.aliasreg){
        out += k+": "+this.aliasreg[k].from+"\t"+this.aliasreg[k].to+"\n";
      }
      return out;
    }),
    rl: new this.Command("rl", (params)=>{
      window.location.reload();
    }),
    alias: new this.Command("alias", (params)=>{
        if(params.length!==2){
            return "[alias] Strange parameter length ("+params.length+") expected (2).\n"
        }
        this.aliasreg[params[0]] = new this.Alias(params[0], params[1]);
        return "";
    }),
    unalias: new this.Command("unalias", (params)=>{
        if(params.length!==1){
            return "[unalias] Strange parameter length ("+params.length+") expected (1).\n"
        }
        delete this.aliasreg[params[0]];
        return "";
    }),
    pmc: new this.Command("pmc", (params) => {
        //return "Not yet implemented.\n";//debug
        if(params.length === 0){
            return "Protection Management Console\nUsage: `pmc [service] [modifier] [set]` OR `pmc [service] help` for help with service OR `pmc help` for a list of usage entries.\n";
        }
        switch(params[0]){
            case "help":
                return (
                    "Protection Management Console\n"
                    +"\tCommands:\n"
                    +"help \t(opt: command)"+" -- (opt: command) NOT YET IMPLEMENTED"+"\n"
                    +"\n"

                    +"\tServices:\n"
                    +"aliasloop \t[allow/disallow]\n"
                );
                //break;
            case "aliasloop":
                switch(params.length){
                    case 1:
                        return "Insufficient Parameters.\n";
                    case 2:
                        switch(params[1]){
                            case "allow":
                                this.ALLOWALIASLOOP = true;
                                return "";
                            case "disallow":
                                this.ALLOWALIASLOOP = false;
                                return "";
                            default:
                                return "Unregistered parameter '"+params[1]+"' ; Use {allow, disallow}\n";
                        }
                    default:
                        return "? ON "+params.length+" aliasloop\n";
                }
                return "";
              case "clickerdisable":
                switch(params.length){
                    case 1:
                        return "Insufficient Parameters.\n";
                    case 2:
                        switch(params[1]){
                            case "allow":
                                this.protect_clickerdisable = false;
                                return "";
                            case "disallow":
                                this.protect_clickerdisable = true;
                                return "";
                            default:
                                return "Unregistered parameter '"+params[1]+"' ; Use {allow, disallow}\n";
                        }
                    default:
                        return "? ON "+params.length+" aliasloop\n";
                }
                return "";//this.protect_clickerdisable
            default: 
                return "Service or method '"+params[0]+"' not found in usage entry registry.\n";//kind of a decepticon, for now. 
        }
        return "[Command(pmc)] ERROR: BAD RETURN 0 ON PARAMETER BUFFER "+JSON.stringify(params)+".\n";
    }),
    clicker: new this.Command("clicker", (params) => {
        if(params.length===0){
          return "Usage: clicker [enable/disable]\nTurns on or off the DebugIO Prompt on click\n";
        }
        switch(params[0]){
          case "enable":
            DebugIO.useclicker = true;
            return "";
          case "disable":
            if(params.includes("force")){
              DebugIO.useclicker = false;
              Console.write("Unsafe disable forced: disable DebugIO Prompt on click.\n");
              return "";
            }else if(DebugIO.useclicker && this.protect_clickerdisable){
              return "ERROR\nDangerous disable detected -- this functionality is disallowed. Use 'pmc clickerdisable allow' to remove protection lock;\nAlternatively, you may use `clicker disable force` to force !!! DANGEROUS !!! disable (which may, in turn, render your system impossible to interact with in some cases).\n"
            }
            DebugIO.useclicker = false;
            return "";
          default:
            return "Unspecified argument: "+params[0]+"\n";
        }
        return "[Command(clicker] Error: Unreachable return\n";
    }),
    ejs: new this.Command("ejs", (params) => {
      let str = "";
      let preout = "";
      if(params.length === 0){
          return "Method for semisafely passing JavaScript strings to eval() [still fully able to modify any system object and run arbitrary code]\nParameters are adjoined into a single string, then evaluated.\nUsage: ejs [valid string] [valid string] ...\nUsage: ejs directprompt -- will bypass string adjoinment and allow direct script pasting via prompt() box method\nParametric Failsafe: ejs [valid JavaScript string with no spaces, will be evaluated BEFORE full string]\n";
        }else if(params[0] === "directprompt"){
          str = prompt();
          if(str === null){
            return "Evaluation canceled.\n"
          }
        }else{
          //str = params.join(";");
          for(let i=0;i<params.length;i++){
            try{
              str+=JSON.parse(params[i]);
            }catch(e){
              try{
                str+=eval(params[i]);
              }catch(e2){
                preout+="[ejs Parameter Error] '"+params[i]+"' unable to be parsed by JSON.parse: "+e.msg+" ; Additional error (e2): "+e2.msg+"\n";
              }
            }
          }
        }
        try{
          return preout+eval(str)+"\n";
        }catch(e){
          return "[ejs Evaluation Error] "+e.msg+"\n";
        }
        return "[ejs] Unreachable return.\n";
    }),
    X: new this.Command("X", (params) => {
        return "";
    }),
  };
  static aliasreg = {
    "list-packages": new this.Alias("list-packages", "lscr"),
    "reload": new this.Alias("reload", "rl"),
  }
  static RegisterCommand(name, callback){
    console.log(this);
    this.cmdreg[name]=new this.Command(name, callback);
  }
  static drive = null;
  static prefstr(){
    let out = "dbg_cmd";
    if(this.drive !== null){
        out += " "+this.drive+this.pathstr();
    }
    out += "% ";
    return out;
  }
  static pathstr(){
    return "/";//dbg
  }
  static framediverter = null;
  static framediverterbuffer = [];
  static flushsystemconsole = true;
  static frame(){

    if(this.flushsystemconsole && Console.Streams.Short !== ""){
        Teletype.out_sw(["","\n[Console] "+Console.Streams.Short+"\n",""]);
        Console.clear();
    }

    if(this.framediverter !== null && this.framediverter !== ""){
      //console.log("framediverter triggered")
        try{
            if(this[this.framediverter] !== undefined){
                this[this.framediverter](this.framediverterbuffer);
            }
        }catch(e){
            Console.write("Error @ dbg_cmd.frame : "+e.msg+"\ndbg_cmd.framediverterbuffer left as : "+JSON.stringify()+"\n");
            this.framediverter = null;
        }
    }else{ 
      this.ip_c.Update();
      if(this.ip_c.file.includes("\n")){
        let cmd = this.ip_c.file.split("\n").join("");
        let ps = this.prefstr();
        this.ip_c.ResetFile();
        Teletype.out_sw(["",ps+cmd+"\n"+this.process_cmd(cmd),""]);
      }
      Teletype.set_post(this.prefstr()+this.ip_c.file);
      Teletype.set_curoff(this.ip_c.curoff);
    }
  }
  static process_cmd(cmdstr, looptracker = []){
    let cmd = SysLib.StrMan.SplitSimpleCommand(cmdstr);
    //console.log(cmd);
    switch(cmd.length){
      case 0:
        return "";
      default:
        if(this.aliasreg[cmd[0]] !== undefined){
          let realcmd = this.aliasreg[cmd[0]].to;
          console.log(realcmd);
          if(looptracker.includes(realcmd) && this.ALLOWALIASLOOP !== true){
            console.log(looptracker);
            return "ERROR\nAlias loop detected -- this functionality is disallowed. Use 'pmc aliasloop allow' to remove protection lock.\n";
          }
          return this.process_cmd(([realcmd].concat(cmd.slice(1,cmd.length))).join(" "), looptracker.concat([cmd[0]]));
        }else if(this.cmdreg[cmd[0]] !== undefined){
          return this.cmdreg[cmd[0]].callback(cmd.slice(1,cmd.length));
        }else{
          return "Command '"+cmd[0]+"' does not exist in registry.\nCommand 'lscr' will list registry contents, command 'help' will provide general assistance.\n";
        }
    }
    return "SERIOUS ERROR @ dbg_cmd.process_cmd\n";
  }
  static droporcontinue([endtime, continuevector = [null, []], dropvector = [null, []], operation_description = "unspecified", alt_op_desc = "drop to command line"]){
    //console.log("doc");
    this.ip_c.Update();
    if(this.ip_c.file.length !== 0){
      this.framediverter = dropvector[0];
      this.framediverterbuffer = dropvector[1];
      this.ip_c.ResetFile();
    }else if(Date.now()>=endtime){
      this.framediverter = continuevector[0];
      this.framediverterbuffer = continuevector[1];
      this.ip_c.ResetFile();//just for rigor
    }else{
      //console.log("docelse");
      Teletype.set_post("Operation ("+operation_description+") will continue in "+Math.ceil((endtime-Date.now())/1000)+" seconds; \nPress any key to pause operation and drop to alternate method: "+alt_op_desc+". ");
    }
  }
  static fdpaddedeval([fdreturnmethod_success, fdreturnmethod_error, jsevalstr]){
    try{
      dbg_cmd.framediverter=fdreturnmethod_success;
      dbg_cmd.framediverterbuffer = [eval(jsevalstr),0];
      return dbg_cmd.framediverterbuffer[0];
    }catch(e){
      dbg_cmd.framediverter=fdreturnmethod_error;
      dbg_cmd.framediverterbuffer=[e.msg,1];
      return e.msg;
    }
  }
  static fdcaterr([s]){
    Console.write("[framediverter error cat] "+s+"\n");
    this.framediverter=null;
  }
}

dbg_cmd.framediverter = "droporcontinue";
//dbg_cmd.framediverterbuffer = [Date.now()+10000, [null, []], [null, []], "default start"];
dbg_cmd.framediverterbuffer = [Date.now()+10000, ["fdpaddedeval", [null, "fdcaterr", "dbg_program.dbgnull=true;"]], [null, []], "Wakelock & Graphical Test"];
dbg_cmd.ip_c.ResetFile();

class DebugIO {
  static useclicker = true;
}

document.addEventListener('click', async () => {
  if(DebugIO.useclicker){
    let dbglin = Teletype.tty_pip[2].slice(0,Teletype.tty_pip[2].length+Teletype.curoff)+"_"+Teletype.tty_pip[2].slice(Teletype.tty_pip[2].length+1+Teletype.curoff,Teletype.tty_pip[2].length);
    let buffer = prompt("(DebugIO Prompt can be enabled/disabled with dbg_cmd command `clicker [enable/disable]` -- only works in debug command line)\n"+dbglin+"\nOK: Submit + Enter ; Cancel: Backspace");
    if(buffer === null){
      Keyboard.keybuffer.push("Backspace");
    }else{
      Keyboard.keybuffer = Keyboard.keybuffer.concat((buffer+"\n").split(""));
    }
  }
});