class Kernel {
    static Messenger = class {

    }
    static CallConstructors = class {

    }
    static InstallMethods_arr_nspair(arr){ // [[name, str_callback_def], ... ]
        //to be recieved from instantiation message
        for(let k in arr){
            try{
                this.CallConstructors[arr[k][0]] = eval(arr[k][1]);
            }catch(e){
                //uh, maybe put something here. 
            }
        }
    }
    static InstallMethods_s_arr_ncpair(s){ // "[[name, callback], ...]" -- better for just writing a file and getting it as plaintext
        //worse in the case that part of the string is malformed, but better for writing and performance
        //really wish you could stringify code but i get it
        let mncpl = [];
        try{
            methods = eval(s);
        }catch(e){
            console.error("Error on InstallMethods_s_arr_ncpair(s): "+e.msg);
        }
        for(let k in mncpl){
            this.CallConstructors[mncpl[k][0]] = mncpl[k][1];
        }
    }
    static Debug = class {
        static QuickTestProcedure = class { //did you get the memo about the new covers for the TPS reports? 
            static TestInstallMethods(){
                Kernel.InstallMethods([
                    ["TestMethod", "(s)=>{console.log(s);}"] 
                ]);
            }
            // yeah, yeah. I got it. 

        } // I'll just send you a copy of that memo. 
    }
}
let k = Kernel;
let Call = Kernel.CallConstructors;
let c = Kernel.CallConstructors;