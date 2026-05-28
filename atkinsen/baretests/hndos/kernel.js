class Console {
    static Relog = false;
    static Streams = class {
        static Long = "";
        static Short = "";
    }
    static write(s){
        Console.Streams.Long += s;
        Console.Streams.Short += s;
        if(this.Relog){console.log(s);}
    }
    static clear(){
        Console.Streams.Short = "";
    }
}

class DeviceBus {
    static DeviceWrapper = class { //use this to route device calls between JavaScript methods
        static Description = class {
            constructor(name = "Indescript_Device", vendorname = "Unknown_Vendor", vendorid = null){
                this.name = name;
                this.vn = vendorname;
                this.vid = vendorid;
            }
        }
        static StandardMethodPlugboard = class {
            constructor(method_write, method_read, method_open, method_close){
                this.m_w = method_write;
                this.m_r = method_read;
                this.m_o = method_open;
                this.m_c = method_close;
            }
        }
        constructor(methods = new DeviceBus.DeviceWrapper.StandardMethodPlugboard((buffer)=>{},(buffer)=>{},(buffer)=>{},(buffer)=>{}), descriptives = new DeviceBus.DeviceWrapper.Description(), persistant_data = class {}){
            this.m = methods;
            this.desc = descriptives;
            this.persist = persistant_data;
        }
        write(databuffer){
            return this.m.m_w(databuffer, this.persist);
        }
        read(databuffer){
            return this.m.m_r(databuffer, this.persist);
        }
        open(databuffer){
            return this.m.m_o(databuffer, this.persist);
        }
        close(databuffer){
            return this.m.m_c(databuffer, this.persist);
        }
    }
    static Devices = [

    ];
    static RegisterDevice(devwrapper){
        this.Devices.push(devwrapper);
        return this.Devices.length-1;
    }
}

class FilesystemManager {

}

class Executable {
    static Program = class { // Contains (class code, string entrypoint)
        constructor(CodeObject, Entrypoint = 'main'){
            this.code = CodeObject;
            this.entrypoint = Entrypoint;
        }
    }
    static Applet = class { // The goal
        constructor(){

        }
    }
}

class JobManager {
    static Job = class {
        constructor(hooklink = 'frame', program){
            this.hooklink = hooklink; //what kernel routing to use in order to call program[program.entrypoint]
            this.program = program; //Executable.Program
        }
    }
    static call(id, force_sync = true){ //push job to JobQueue
        this.JobQueue.push(new this.QueueEntry(
            id, force_sync
        ));
        return id; //cat
    }
    static return(retcode){

    }
    static JobQueue = []; //call(id)
    static Jobs = []; //id = create(Job)
    static FreeIDs = [];
    static create(job){ //push to Jobs
        let id;
        if(this.FreeIDs.length!==0){
            id = this.FreeIDs.pop();
            this.Jobs[id] = job;
        }else{
            id = this.Jobs.length;
            this.Jobs.push(job);
        }
        return id;
    }
    static destroy(id){ //full cleanup

    }
    static QueueEntry = class {
        constructor(JobID, force_sync = true){
            this.id = JobID;
            this.sync = force_sync; //whether job *NEEDS* to execute synchronously
        }
    }
    static frame(){
        //this.procbatch();
        this.dbg_procbatchsync(); //dbg
    }
    static dbg_procbatchsync(){
        for(let i=0;i<this.JobQueue.length;i++){
            if(this.Jobs[this.JobQueue[i].id].hooklink === 'frame'){
                try{
                    this.Jobs[this.JobQueue[i].id].program.code[this.Jobs[this.JobQueue[i].id].program.entrypoint]();
                }catch(e){
                    console.log("ERROR", e.msg);
                }
            }
        }
    }
    static procbatch(){
        let codedbatch = {sync: [], async: []};
        for(let i=0;i<this.JobQueue.length;i++){
            if(this.JobQueue[i].sync){
                codedbatch.sync.push(this.JobQueue[i].id);
            }else{
                codedbatch.async.push(this.JobQueue[i].id);
            }
        }
        this.docodedbatch(codedbatch);
    }
    static async docodedbatch(batch){
        //await this.procasyncbatch(codedbatch.async);
        //await this.procsyncbatch(codedbatch.sync);
        await Promise.allSettled([this.procsyncbatch(batch.sync),this.procsyncbatch(batch.async)]);
    }
    static async procasyncbatch(batch){
        console.log("SORRY: DROPPED BATCH (async batch not yet implemented. do not use)", batch);
    }
    static async procsyncbatch(batch){
        for(let i=0;i<batch.length;i++){
            this.Jobs[batch[i]].program.code[this.Jobs[batch[i].program.entrypoint]]();
        }
    }
}