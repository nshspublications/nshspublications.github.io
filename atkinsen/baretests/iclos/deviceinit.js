/*{
    let id = DeviceBus.RegisterDevice(new DeviceBus.DeviceWrapper(
        new DeviceBus.DeviceWrapper.StandardMethodPlugboard(
            (buf, persist)=>{
                Console.write("[DbgEchoerDev] Recieved:\n"+JSON.stringify(buf)+"\n");
                return 0; //0: Operation Successful
            },
            (buf, persist)=>{

            },
            (buf, persist)=>{

            },
            (buf, persist)=>{

            }
        ),
        new DeviceBus.DeviceWrapper.Description(
            "Debug_Echoer_Device",
            "HNetDOSDevTeam",
            0
        ),
        class {
            static stack = [];
        }
    ));
}*/

class VirtualDevices {
    static BasicFloppy = class {
        static Driver = class {

        };
        constructor(){

        }
    }
}