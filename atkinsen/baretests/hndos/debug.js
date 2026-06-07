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
    this.routine();
  }
  static routine(){
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
  static effectivewidth = 55;
  static realtablength = Math.ceil(Teletype.get_tab_size()[0]/Teletype.get_space_size()[0]);
  static ip_c = new Calipers2.PromptStream();
  static ALLOWALIASLOOP = false;
  static protect_clickerdisable = true;
  static Command = class {
    static HelpPage = class {
      constructor(purpose = "", usage = "", extra = "", disable = false){
        this.purpose = purpose;
        this.usage = usage;
        this.extra = extra;
        this.disable = disable || purpose.length+usage.length+extra.length === 0;
      }
    }
    constructor(name, callback, helper = new dbg_cmd.Command.HelpPage()){
      this.name = name;
      this.callback = callback;
      this.helper = helper;
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
      //let maxlen = 27;
      let minlen = 26;
      let faketab = "    "; //half-length
      //debug message dbg
      //return "Help command not yet implemented.\n";
      //return "dbg\n";
      switch(params.length){
        case 0:
          let aliases = [];
          let aliasesto = [];
          for(const k in dbg_cmd.aliasreg){
            aliases.push(dbg_cmd.aliasreg[k].to);
            aliasesto.push(dbg_cmd.aliasreg[k].from);
          }
          console.log(aliases, aliasesto);
          let out = "Use `help [command]` for help with any listed command\nAvailable commands: (use `help more` for expanded version)\n";
          let cycle = 0;
          //dbg_cmd.effectivewidth = 55;
          let clen = Math.max(1,Math.floor(dbg_cmd.effectivewidth/minlen));
          let span = Math.max(1,Math.floor(dbg_cmd.effectivewidth/clen)-1);
          console.log(dbg_cmd.effectivewidth/minlen,dbg_cmd.effectivewidth/clen);
          let spanstr = "";
          for(let i=0;i<span;i++){
            spanstr+=" ";
          }
          console.log(clen, span);
          for(const k in dbg_cmd.cmdreg){
            //out+=k+"\n";//dbg
            //console.log(k);
            if(dbg_cmd.cmdreg[k].helper.disable){
              continue;
            }
            let name = dbg_cmd.cmdreg[k].name;
            if(aliases.includes(name)){
              for(let i=0;i<aliases.length;i++){
                if(aliases[i] === dbg_cmd.cmdreg[k].name){
                  name += "/"+aliasesto[i];
                }
              }
            }
            let namehead = name+" ";
            for(let i=0;namehead.length%dbg_cmd.realtablength!==0;i++){
              namehead+=" ";
            }
            //let rnhl = Math.ceil((name+" ").length/dbg_cmd.realtablength)*dbg_cmd.realtablength;
            let purp = dbg_cmd.cmdreg[k].helper.purpose;
            let pe = (
              namehead
              +dbg_cmd.cmdreg[k].helper.usage+faketab
              +purp
              //+dbg_cmd.cmdreg[k].helper.extra
              //+"\n"
            );
            //let tabamt = pe.split("\t").length-1;
            //let tabspace = tabamt*(dbg_cmd.realtablength-1);
            //let realpelen = rnhl+purp.length;
            //let discrep = realpelen-pe.length;
            //console.log(discrep);
            let rpe = pe.slice(0, span-2)+spanstr.slice(Math.min(span, pe.length)); //shooting for span-2
            out += rpe;
            cycle++;
            if(cycle === clen){
              out += "\n";
              cycle=0;
            }else{
              out += "  ";
            }
          }
          return out+"\n";
        case 1:
          if(params[0] === "more"){
            let aliases = [];
            let aliasesto = [];
            for(const k in dbg_cmd.aliasreg){
              aliases.push(dbg_cmd.aliasreg[k].to);
              aliasesto.push(dbg_cmd.aliasreg[k].from);
            }
            console.log(aliases, aliasesto);
            let out = "Use `help [command]` for help with any listed command\nAvailable commands: \n";
            for(const k in dbg_cmd.cmdreg){
              //out+=k+"\n";//dbg
              //console.log(k);
              if(dbg_cmd.cmdreg[k].helper.disable){
                continue;
              }
              let name = dbg_cmd.cmdreg[k].name;
              if(aliases.includes(name)){
                for(let i=0;i<aliases.length;i++){
                  if(aliases[i] === dbg_cmd.cmdreg[k].name){
                    name += "/"+aliasesto[i];
                  }
                }
              }
              out+= (
                name+"\t\t"
                +dbg_cmd.cmdreg[k].helper.usage+"\n\t"
                +dbg_cmd.cmdreg[k].helper.purpose+"\n\t"
                //+dbg_cmd.cmdreg[k].helper.extra
                //+"\n"
              );
              if(dbg_cmd.cmdreg[k].helper.extra.length !== 0){
                out += dbg_cmd.cmdreg[k].helper.extra
              }
              out += "\n";
            }
            return out;
            //break;
          }
        default:
          return "";
      }

      return "Error: impossible end @ cmdreg.help\n";
    }, new dbg_cmd.Command.HelpPage(
      "Retrieve helpful information about built-in commands",
      "help [command (optional)]",
      "Some commands may not be listed here, due to absent help page registration. Use `lscr` for a full list of commands.",
    )),
    lscr: new this.Command("lscr", (params)=>{
      //return JSON.stringify(this.cmdreg)+"\n";
      let out = "";
      let verbose = params.includes("-v") || params.includes("--verbose") || params.includes("v");
      out += "Commands:\n";
      let off = 0;
      let line = "";
      //let commit = "";
      for(const k in this.cmdreg){
        let commit = "";
        commit += this.cmdreg[k].name;
        //console.log(this.cmdreg[k].callback);
        if(verbose){
          commit+="\n"+(this.cmdreg[k].callback.toString());
        }
        //out+="\n";
        if(verbose){
          out += commit+"\n";
        }else{
          commit+=" ";
          while(commit.length%8!==0){
            commit+=" ";
          }
          if(line.length+commit.length >= dbg_cmd.effectivewidth){
            out+=line+"\n"+commit;
            line="";
            commit="";
          }else{
            line+=commit;
            commit="";
          }
        }
      }
      if(out.charAt(out.length-1)!=="\n"){out+="\n"}
      out += "Aliases:\n[k]             from            to\n";
      for(const k in this.aliasreg){
        let line = k+": "
        while(line.length%16!==0){
          line+=" ";
        }
        line += this.aliasreg[k].from+" ";
        while(line.length%16!==0){
          line+=" ";
        }
        line+=this.aliasreg[k].to;
        while(line.length%16!==0){
          line+=" ";
        } 
        out += line+"\n";
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
    }, new dbg_cmd.Command.HelpPage(
      "Register an alias",
      "alias [new entry] []",
      "Aliases allow one command to be referenced by multiple names",
    )),
    unalias: new this.Command("unalias", (params)=>{
        if(params.length!==1){
            return "[unalias] Strange parameter length ("+params.length+") expected (1).\n"
        }
        delete this.aliasreg[params[0]];
        return "";
    }, new dbg_cmd.Command.HelpPage(
      "Deregister an alias",
      "unalias [alias]",
      "Warning: can break alias chains (if you don't know, you don't need to, but only delete aliases you were responsible for creating)",
    )),
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
                    +"clickerdisable \t[allow/disallow]\n"
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
    ctxmhack: new this.Command("ctxmhack", (params) => {
        if(params.length===0){
          return "Usage: ctxmhack [enable/disable]\nTurns on or off the DebugIO Alert Dialog + Inspect Tip on right click\n";
        }
        switch(params[0]){
          case "enable":
            DebugIO.ctxmhack = true;
            return "";
          case "disable":
            DebugIO.ctxmhack = false;
            return "";
          default:
            return "Unspecified argument: "+params[0]+"\n";
        }
        return "[Command(ctxmhack] Error: Unreachable return\n";
    }),
    clear: new this.Command("clear", (params) => {
      Teletype.clear();  
      return "";
    }, new dbg_cmd.Command.HelpPage(
      "Clear screen",
      "clear",
      ""
    )),
    font: new this.Command("font", (params) => {
      if(params.length===0){
        return "Change teletype font\nUsage: font [font name]\n";
      }  
      Teletype.set_font(SysLib.StrMan.CoerceStringyParameter(params[0]));
      return "";
    }),
    cursor: new this.Command("cursor", (params) => {
      if(params.length===0){
        return "Change teletype cursor character\nUsage: cursor [string -- tip: use '\\uXXXX' for special unicode characters; default: \"\\u2588\" aka \u2588 (<-- if this is invisible, change font to System)]\n";
      }  
      Teletype.curchar = (SysLib.StrMan.CoerceStringyParameter(params[0]));
        return "";
    }),
    bfgfxt: new this.Command("bfgfxt", (params) => {
        dbg_cmd.framediverter = "EXTERN_C";
        dbg_cmd.framediverterbuffer = ["dbg_program", "routine", []];
        return "";
    }, new dbg_cmd.Command.HelpPage(
      "Boot into the BrainF- Interpreter Graphical Test debug application",
      "bfgfxt",
      "This application uses a low-level execution paradigm, and SHOULD NOT be run if any execution context higher than this debug console is actively running, as runtime coordination errors are liable to occur."
    )),
    X: new this.Command("X", (params) => {
        return "";
    }, new dbg_cmd.Command.HelpPage(
      "Placeholder command",
      "X",
      "(Extra text)"
    )),
  };
  static aliasreg = {
    "list-packages": new this.Alias("list-packages", "lscr"),
    "reload": new this.Alias("reload", "rl"),
    "clr": new this.Alias("clr", "clear"),
    "cls": new this.Alias("cls", "clear"),
  }
  static RegisterCommand(name, callback){
    console.log(this);
    this.cmdreg[name]=new this.Command(name, callback);
  }
  static GetTTYSizeInChars(){
    //Warning: only works with monospace fonts
    let char = Teletype.get_space_size();
    return [Math.floor(window.innerWidth/char[0] + 0.09), Math.floor(window.innerHeight/char[1] + 0.09)];
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
  static fdstack = [];
  static flushsystemconsole = true;
  static push_fd(diverter, diverterbuffer){ //returns new process spot
    this.fdstack.push([this.framediverter, this.framediverterbuffer]);
    this.framediverter = diverter;
    this.framediverterbuffer = diverterbuffer;
    return this.fdstack.length-1;
  }
  static pop_fd(){ //returns popped process spot
    let p = this.fdstack.pop();
    this.framediverter = p[0];
    this.framediverterbuffer = p[1];
    return this.fdstack.length;
  }
  static PFDP_E_dbgmesg([message]){
    Console.write(message);
    return this.pop_fd();
  }
  static EXTERN_F([funccode, buffer]){
    try{return eval(funccode)(buffer);}catch(e){
      Console.write("[EXTERN_F] Error with arguments ("+JSON.stringify([funccode, buffer])+"): "+e.msg+"\n");
    }
  }
  static EXTERN_C([classname, funcname, buffer]){
    //console.log(eval(classname)[funcname]);
    try{return eval(classname)[funcname](buffer);}catch(e){
      Console.write("[EXTERN_C] Error with arguments ("+JSON.stringify([classname, funcname, buffer])+"): "+e.msg+"\n");
    }
  }
  static TTYSize = [null,null];
  static frame(){
    if(Graphics.autoresize()){
      this.TTYSize = this.GetTTYSizeInChars();
      this.effectivewidth = this.TTYSize[0];
    }

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
        Teletype.out_sw(["",ps+cmd+"\n",""]);
        Teletype.out_sw(["",this.process_cmd(cmd),""]);
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
          try{return this.cmdreg[cmd[0]].callback(cmd.slice(1,cmd.length));}catch(e){
            console.error(e.msg, e);
            return e.msg+"\n";
          }
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
  static ctxmhack = true;
}

document.addEventListener('click', async () => {
  PushTools.clickhandle();
  if(DebugIO.useclicker){
    let dbglin = Teletype.tty_pip[2].slice(0,Teletype.tty_pip[2].length+Teletype.curoff)+"_"+Teletype.tty_pip[2].slice(Teletype.tty_pip[2].length+1+Teletype.curoff,Teletype.tty_pip[2].length);
    let buffer = prompt("(DebugIO Prompt can be enabled/disabled with dbg_cmd command `clicker [enable/disable]` -- only works in debug command line)\n"+dbglin+"\nOK: Submit + Enter ; Cancel: Backspace");
    if(buffer === null){
      Keyboard.keybuffer.push("Backspace");
    }else{
      Keyboard.keybuffer = Keyboard.keybuffer.concat((buffer+"\n").split(""));
    }
  }
  //PushTools.dbgpush();
});

document.addEventListener('contextmenu', (event) => {
  // Prevent the default browser context menu
  event.preventDefault(); 
  
  //console.log('Right-click intercepted!');
  if(DebugIO.ctxmhack){
    Console.write("Debug helper:\nControl + Shift + J \t[Windows]\nCommand + Option + J \t[macOS]\n\nControl/Command + R can refresh page from alert box\n");
    alert("You can successfully execute key combinations from here\nControl + Shift + J \t[Windows]\nCommand + Option + J \t[macOS]\n\nControl/Command + R can refresh page");
  }
});
