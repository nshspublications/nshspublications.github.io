class SysLib {
    static Enum = class {
        static Enumerate(list){
            let out = {};
            for(let i=0;i<list.length;i++){
                out[list[i]]=i;
                out[i]=list[i];
            }
            return out;
        }
    }
    static StrMan = class {
        //String Manipulation
        static SplitSimpleCommand(s){
            //return s.split(' '); //debug
            let out = [];
            let t = '';
            let inq = false;
            let qch;
            let esc = false;
            let hws = true;

            for(let i=0;i<s.length;i++){
                let chr = s.charAt(i);
                if(esc){
                    esc=false;
                    t += chr;
                }else if(chr === "\\"){
                    t += "\\";
                    hws=false;
                    esc = true;
                }else if(inq){
                    t += chr;
                    if(chr === qch){
                        inq = false;
                    }
                }else if(chr === "\"" || chr === "'"){
                    hws=false;
                    inq = true;
                    qch = chr;
                    t += chr;
                }else if(chr === " " || chr === "\t" || chr === "\v"){
                    if(hws){
                        //
                    }else{
                        out.push(t);
                        t="";
                        hws=true;
                    }
                }else{
                    t+=chr;
                    hws=false;
                }
            }
            if(t.length !== 0){
                out.push(t);
            }
            return out;
        }
        static CoerceStringyParameter(s){
            if(s.charAt(0) === "'"){
                s = "\"" + s.slice(1,s.length-1) + "\"";
            }
            try{
                return JSON.parse(s);
            }catch(e){
                return s;
            }
        }
    }
    static FS = class { //filesystem work
        static fixfchain(l){
            //if(Debug.GLOBAL_DBG){Teletype.out_sw(['','fixfchain: \n'+JSON.stringify(l)+"\n",'']);/*debug*/}
            //Debug.Do(() => {},[]);
            Debug.ConLog('fixfchain: \n'+JSON.stringify(l)+"\n");
            if(l.length===0){
                return [''];
            }else if(l.length!==1 && l[l.length-1] === ""){
                return l.slice(0,l.length-1);
            }
            return l;
        }
        static PathStrToFChain(s){
            // /
            // ./
            // ../
            // ~/
            // other

            if(!(s.includes("\"") || s.includes("'") || s.includes("\\"))){
                return this.fixfchain(s.split('/'));
            }

            let out = [];
            let t = "";
            let qch = "";
            let inq = false;
            let esc = false;
            for(let i=0;i<s.length;i++){
                let chr = s.charAt(i);
                if(esc){
                    t+=chr;
                    esc=false;
                }else if(inq){
                    if(chr === qch){
                        inq=false;
                    }else{
                        t+=chr;
                    }
                }else if(chr === "\"" || chr === "'"){
                    qch = chr;
                    inq = true;
                }else if(chr === "/"){
                    out.push(t);
                    t="";
                }else if(chr === "\\"){
                    esc=true;
                }else{
                    t += chr;
                }
            }
            //if(t.length!==0){
            out.push(t);
            //}
            return this.fixfchain(out);
        }
        static PathStrToFChainByCDH(s, cd, home){
            let p = this.PathStrToFChain(s);
            let cda = this.PathStrToFChain(cd);
            let h = this.PathStrToFChain(home);
            // '' at i=0 becomes fs root
            // . at i=0 becomes cd..this(p[1:len-1])
            // .. at i=0 becomes above(cd)..this(p[1:len-1])
            // ~ at i=0 becomes home..this(p[1:len-1])
            return this.fixfchain(this.CDHwArrs(p,cda,h));
        }
        static CDHwArrs(l, cd, h){
            if(l.length===0){
                //uh. idk
                if(cd.length === 0){
                    return [''];
                }
                return cd;
            }else{
                switch(l[0]){
                    case "": //absolute path
                        return l;
                    case ".":
                        return cd.concat(this.CDHwArrs(l.slice(1,l.length),cd,h));
                    case "..":
                        //l | cd
                        //'..' '..' '..' 'f' | '' 'temp' 'root' 't'
                        //'..' '..' 'f' | '' 'temp' 'root'
                        //'..' 'f' | '' 'temp'
                        //'f' | ''
                        //'f' | '' 'f'
                        //return (cd.slice(0,cd.length-1)).concat(this.CDHwArrs(l.slice(1,l.length),cd,h));
                        //return this.CDHwArrs(l.slice(1,l.length).concat(['.']), cd.slice(0,cd.length-1), h);
                        if(Debug.GLOBAL_DBG){Teletype.out_sw(['','Processing :\n\t'+JSON.stringify(l)+"\n\t"+JSON.stringify(cd)+"\n\t"+JSON.stringify(h)+"\n",'']);/*debug*/}
                        return this.CDHwArrs(l.slice(1, l.length), cd.slice(0,cd.length-1), h)
                    case "~":
                        return h.concat(this.CDHwArrs(l.slice(1,l.length),cd,h));
                    default:
                        return cd.concat(l); //
                }
            }
        }
    }
    static TaskStack = class {
        constructor(){
            this.ids = [];
        }
        Run(callback){
            let uuid = crypto.randomUUID();
            while(this.ids[uuid] !== undefined){
                uuid = crypto.randomUUID();
            }
            this.ids[uuid] = [false, undefined]; //Array containing 
        }
        Return(id, returnobject){
            this.ids[id] = [true, returnobject];
        }
        Free(id){
            this.ids[id] = undefined;
        }
    }
}