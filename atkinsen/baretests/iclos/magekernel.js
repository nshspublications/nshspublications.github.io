//MAGE Research Subsystem
//
//Aubregine * Caliper
//hnetlabs (c. 2026)
//H A C K E R S   N E T W O R K  Associated

//SpellWrapper:
//  .

//COMPREX:
//  Extended BfVM Bytecode - branched from beph3/B3 development planning
//EJS (Evaluated JavaScript):
//  .
//ECJS (Evaluation-Cached JS Class):
//  .

//export keys:
let __MAGE = {
    kernel: null,
    compiler_success: false,
    compiler_warnerror: false,
    compiler_errors: null, //if null, WEIRD_ERROR; if array, specified error; if ERROR object, general [uncaught compilation] error. 
};

{ //internal work:
    try{
        __MAGE.compiler_errors = [];
        //internal work:
        let GRAPHICS_INCOMPLETE = true;
        class mage_kernel {
            static splash_screen_routine = () => {};
        }
        if(GRAPHICS_INCOMPLETE){
            //while BIOS.Graphics is not ready
            mage_kernel.splash_screen_routine = (cmsg = "Please wait...") => {
                let g = BIOS.Graphics.DirectDeviceLink;
                g.clear();
                g.fill([0,0,255]);
                g.background();
                g.font('bold 32px Times');
                g.fill([255,255,50]);
                g.text('MAGE System I', [g.width/16, g.height/16]);
                g.font('italic 16px Times');
                g.text('Aubregine & Caliper', [g.width/16, 32+g.height/16]);
                g.font('14px Courier');
                g.text('H A C K E R S   N E T W O R K  Associated', [g.width/16, 32+16+g.height/16]);

                g.font("12px AtkinMono");
                g.text(cmsg, [g.width/16, 64+32+16+g.height/16]);
            };
        }else{
            //when BIOS.Graphics is ready

        }

        //export:
        __MAGE.kernel = mage_kernel;
        __MAGE.compiler_success = true;
    }catch(ERROR){
        //
        compiler_errors = ERROR;
        console.warn("MAGE Kernel general compilation error:",ERROR.msg);
    }
}