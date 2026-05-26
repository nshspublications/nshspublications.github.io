class dbg_program {
  static ip_c = new Calipers2.PromptStream();
  static dbgnull = false;
  static frame(){
    if(!this.dbgnull){
      return dbg_cmd.frame();
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
  static frame(){
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
          if(looptracker.includes(realcmd)){
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
}