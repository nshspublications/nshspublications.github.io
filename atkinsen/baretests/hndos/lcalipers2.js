class Calipers2 {
    static framecall = () => {};
    static animatecall = () => {Calipers2.framecall();window.requestAnimationFrame(Calipers2.animatecall)};
    static setframecall(call){
        Calipers2.framecall = call;
        Calipers2.animatecall();
    }
    static Tools = class {
        static StdKeyHandler(SpecialKeyCallback, InputStream){
            if(InputStream.length === 1){
                return InputStream;
            }
            switch(InputStream){
                case "Tab":
                    return "\t";
                case "Enter":
                    return "\n";
                default:
                    return SpecialKeyCallback(InputStream);
            }
        }
        static PromptStreamKeyHandler(callback, s){
    
        }
        static clamp(min, x, max){
            return Math.max(min, Math.min(max, x));
        }
    }
    static PromptStream = class {
        constructor(){
            this.file = "";
            this.curoff = 0; //- for left, + for right (towards EOF)
            this.backspacequeue = 0;
            this.deletequeue = 0;
            this.curoffchange = 0;
            this.callback = (keystr) => {}; //THIS DOES NOT GET RESET !!! !!!
        }
        ResetFile(){
            this.file = "";
            this.curoff = 0; //- for left, + for right (towards EOF)
            this.backspacequeue = 0;
            this.curoffchange = 0;
        }
        Update(){
            let befcuroff = this.curoff;
            this.file = this.file.slice(0,this.file.length+befcuroff) + Keyboard.flush((str) => Calipers2.Tools.StdKeyHandler((spec) => this.kbfcallback(spec), str)) + this.file.slice(this.file.length+befcuroff,this.file.length);
            this.file = this.file.slice(0,Math.max(0,this.file.length+befcuroff-this.backspacequeue)) + this.file.slice(Math.max(0,this.file.length+befcuroff),this.file.length);
            this.file = this.file.slice(0,Math.max(0,this.file.length+befcuroff)) + this.file.slice(Math.max(0,this.file.length+befcuroff+this.deletequeue),this.file.length);
            this.backspacequeue = 0;
            this.curoff = Calipers2.Tools.clamp(-this.file.length,this.curoff+this.curoffchange+this.deletequeue,0);
            this.deletequeue = 0;
            this.curoffchange = 0;
        }
        SetSpecialHandleCallback(callback){
            this.callback = callback;
        }
        kbfcallback(key){
            switch(key){
                case "Backspace":
                    this.backspacequeue++;
                    return "";
                case "Delete":
                    if(this.redirectdelete){
                        this.backspacequeue++;
                    }else{
                        this.deletequeue++;
                    }
                    return "";
                case "ArrowLeft":
                    this.curoffchange--;
                    return "";
                case "ArrowRight":
                    this.curoffchange++;
                    return "";
                /*case "ArrowDown": //
                    return "";
                case "ArrowUp": //
                    return "";*/
                default:
                    this.callback(key);
                    return "";
            }
        }
    }
    static TeletypeObject = class {
        constructor(etty, ectty, ectty_cur){
            this.tty = etty;
            this.ctty = ectty;
            this.ctty_cur = ectty_cur;
    
            this.curchar = "\u2588";
            this.tty_pip = ["", "", ""];
            this.doscrolls = true;
            this.hide_stack = [];
            this.curoff = 0;
    
            this.remember_font = this.tty.style.fontFamily;
    
            this.ghost = 0;
            this.ghoststack = [];
    
            this.redirectdelete = false;
        }
        set_curoff(n){
            this.curoff=n;
        }
        clear(){
            this.tty_pip = ["", "", ""];
            this.deadrefresh();
            this.scroll();
        }
        scroll(){
            if(this.doscrolls){
                this.ctty_cur.scrollIntoView({behavior: 'instant', block: 'end'});
            }
        }
        deadrefresh(){
            this.ctty.textContent = this.generateCttyString(this.tty.textContent);
        }
        generateCttyString(s){
            /*let out = s;
            out = out.slice(0,out.length+curoff);
            return out;*/
            return s.slice(0,s.length+this.curoff);
        }
        ghoststr(){
            let out = "";
            for(let i=0;i<this.ghost;i++){
                out+="\n\u3164";
            }
            return out;
        }
        set_ghost(n){
            this.ghost=n;
        }
        push_ghost(n){
            this.ghoststack.push(this.ghost);
            this.ghost=n;
        }
        pop_ghost(){
            if(this.ghoststack.length === 0){
                // error? nah. 
            }else{
                this.ghost = this.ghoststack.pop();
            }
        }
        set_hide(b){
            this.tty.hidden = b;
            this.ctty.hidden = b;
            this.ctty_cur.hidden = b;
        }
        set_hide_push(b){
            this.hide_stack.push(this.tty.hidden);
            this.set_hide(b);
        }
        set_hide_pop(){
            this.set_hide(this.hide_stack.pop());
        }
        out_sw([_pre,_in,_post]){
            this.tty_pip[0] += _pre;
            this.tty_pip[1] += _in;
            this.tty_pip[2] += _post;
            this.refresh();
        }
        set_sw(pip){
            this.tty_pip = pip;
            this.refresh();
        }
        set_pre(s){
            this.tty_pip[0] = s;
            this.refresh();
        }
        set_in(s){
            this.tty_pip[1] = s;
            this.refresh();
        }
        set_post(s){
            this.tty_pip[2] = s;
            this.refresh();
        }
        refresh(){
            this.tty.textContent = this.tty_pip[0] + this.tty_pip[1] + this.tty_pip[2];
            this.ctty.textContent = this.generateCttyString(this.tty.textContent);
            this.ctty_cur.textContent = this.curchar+this.ghoststr();
            //this.deadrefresh();
            this.scroll();
        }
        out(s){
            this.out_sw(["",s,""]);
        }
        set_font(s){
            this.tty.style.fontFamily = s;
            this.ctty.style.fontFamily = s;
            this.ctty_cur.style.fontFamily = s;
            this.remember_font = s;
        }
    }
    static Teletype;
    static GraphicsObject = class {
        constructor(canvas_element){
            this.canvas = canvas_element;
            this.ctx = canvas_element.getContext("2d");
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.rem_font = "16px monospace";
            this.isVisible = true;
            this.visibility_stack = [];
        }
        autoresize(){
            if(self.innerWidth === this.width && self.innerHeight === this.height){
                return;
            }
            this.width = this.canvas.width = self.innerWidth;
            this.height = this.canvas.height = self.innerHeight;
        }
        setVisibility(b){
            this.isVisible = !(this.canvas.hidden = !b);
        }
        setVisibility_push(b){
            this.visibility_stack.push(this.isVisible);
            this.setVisibility(b);
        }
        setVisibility_pop(){
            this.setVisibility(this.visibility_stack.pop());
        }
        clear(){
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        }
        whv(){
            return [this.width, this.height];
        }
        fill([r,g,b]){
            this.ctx.fillStyle = "rgb("+r+" "+g+" "+b+")";
        }
        setGlobalAlpha(a){
            this.ctx.globalAlpha = a;
        }
        background(){
            this.ctx.fillRect(0,0,this.width,this.height);
        }
        font(s){
            this.remember_font = s;
            this.ctx.font = s;
        }
        text(s,[x,y]){
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.font = this.remember_font;
            this.ctx.fillText(s,x,y);
        }
        rect([x,y],[w,h]){
            this.ctx.fillRect(x,y,w,h);
        }
        line([x0,y0],[x1,y1]){
            this.ctx.beginPath();
            this.ctx.moveTo(x0,y0);
            this.ctx.lineTo(x1,y1);
            this.ctx.stroke();
        }
        stroke([r,g,b]){
            this.ctx.strokeStyle = "rgb("+r+" "+g+" "+b+")";
        }
        stroke_a([r,g,b,a]){
            this.ctx.strokeStyle = "rgba("+r+", "+g+", "+b+", "+a+")";
        }
        strokeWeight(x){
            this.ctx.lineWidth = x;
        }
        circle([x,y],r){
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, r, r, 0, 0, Math.PI*2);
            this.ctx.fill();
        }
    }
    static Graphics;
    static Keyboard = class {
        static keybuffer = [];
        static wasbs = 0;
        static keybuffer_backlog;
        static keysdown = {};
        static kbpush(e){
        //console.log(e.key);
            this.keybuffer.push(e.key);
        }
        static keydown(key){
            this.keysdown[key]=true;
        }
        static keyup(key){
            this.keysdown[key]=false;
        }
        static flush(KeyHandler){ //ex: str += Keyboard.flush((s) => LCTools.StdKeyHandler((specstr) => "", s));
            let out = "";
            this.keybuffer_backlog = [];
            for(let i=0;i<this.keybuffer.length;i++){
                out += KeyHandler(this.keybuffer[i]);
            }
            this.keybuffer = [...this.keybuffer_backlog];
            return out;
        }
        static stdflush(){
            let out = "";
            this.keybuffer_backlog = [];
            for(let i=0;i<this.keybuffer.length;i++){
                out += Calipers2.Tools.StdKeyHandler((specstr) => "", this.keybuffer[i]);
            }
            this.keybuffer = [...this.keybuffer_backlog];
            return out;
        }
    }
    static Mouse = class {
        static clickbuffer = [];
        static clickstatuses = {};
        static movement = [0,0];
        static position = [0,0];
        static on_mousedown(e){
            //console.log(e);
            this.clickstatuses['mouse'+e.button] = true;
            this.clickbuffer.push(['mouse'+e.button,[e.clientX,e.clientY]]);
        }
        static on_mouseup(e){
            this.clickstatuses['mouse'+e.button] = false;
        }
        static on_wheel(e){
            //this is more like a key
            //console.log(e);
            this.clickbuffer.push(['mwheel'+this.signtoud(e.wheelDelta),[e.clientX,e.clientY]]);
        }
        static signtoud(n){
            if(n>0){
                return "up";
            }
            if(n<0){
                return "down";
            }
            return "";//flat?
        }
        static clearclickbuffer(){
            this.clickbuffer = [];
        }
        static clearmovement(){
            this.movement = [0,0];
        }
        static on_mousemove(e){
            //console.log(e);
            // console.log(e.movementX, e.movementY);
            // console.log(this.movement);
            // if(this.acquiredPointerLock){
                
            this.movement[0] += e.movementX;
            this.movement[1] += e.movementY;
            this.position[0] = e.clientX;
            this.position[1] = e.clientY;
            // }
        }
        static _pressed(keyval){
            for(let i=0;i<this.clickbuffer.length;i++){
                if(this.clickbuffer[i][0] === keyval){
                    return true;
                }
            }
            return false;
        }
        static _down(keyval){
            return this.clickstatuses[keyval] === true;
        }
        /*static _methodswitch(method, keyval){
            return [this._pressed, this._down][method](keyval);
        }*/
    }
}

Calipers2.Graphics = new Calipers2.GraphicsObject(document.getElementById("canvas_element"));
var Graphics = Calipers2.Graphics; //Legacy
console.log(Calipers2.Graphics);
Calipers2.Teletype = new Calipers2.TeletypeObject(document.getElementById("tty"),document.getElementById("ctty"),document.getElementById("ctty_cur"));
var Teletype = Calipers2.Teletype; //Legacy
Calipers2.Teletype.clear();

var Keyboard = Calipers2.Keyboard; //Legacy
var Mouse = Calipers2.Mouse; //Legacy

addEventListener("scroll", (event) => { event.preventDefault(); });
document.addEventListener("wheel", (event) => {/*event.preventDefault();*/ Calipers2.Mouse.on_wheel(event)});
Calipers2.Graphics.canvas.addEventListener("mousedown", (event) => {Calipers2.Mouse.on_mousedown(event);});
Calipers2.Graphics.canvas.addEventListener("mouseup", (event) => {Calipers2.Mouse.on_mouseup(event);});
document.addEventListener("mousemove", (e) => Calipers2.Mouse.on_mousemove(e), false);

document.addEventListener("keydown", (event) => {
    event.preventDefault();
        //if(isMobile){
              //cout("[dbg]: keydown\n");
          //}
        //keybuffer.push(event.key);
        Calipers2.Keyboard.kbpush(event);
        //alert(event.key);
        Calipers2.Keyboard.wasbs = Math.max(0, Calipers2.Keyboard.wasbs + 1);
        Calipers2.Keyboard.keydown(event.key);
    });
    
    document.addEventListener("keyup", (event) => {
        Calipers2.Keyboard.keyup(event.key);
    if(Calipers2.Keyboard.wasbs===0){
            //keybuffer.push(event.key);alert("keypress:"+event.key);
            Calipers2.Keyboard.kbpush(event);
        }else{
            Calipers2.Keyboard.wasbs--;
        }
    });

//Calipers2.animatecall();