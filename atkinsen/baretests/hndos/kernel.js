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
        constructor(method_write, method_read){
            this.m_write = method_write;
            this.m_read = method_read;
        }
        write(){

        }
        read(){

        }
    }
    static Devices = [

    ];
}

class FilesystemManager {

}

class JobManager {
    static call(){

    }
    static return(){

    }
}