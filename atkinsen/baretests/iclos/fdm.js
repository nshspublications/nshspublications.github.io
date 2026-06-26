//(Static) File Delivery Module

console.log("REACHED fdm.js");

// import jsonData from './info_gsnic.json' with { type: 'json' }; //debug
// console.log(jsonData); //debug

async function import_test(fn, type = 'json'){
    const { default: data } = await import(fn, { with: { type: type } });
    return data;
}

class Internal {
    static async getlocal_fetch_text(path){
        return await (async () => {
            try {
                const response = await fetch(path);
                const data = await response.text();
                console.log(data);
                return data;
            } catch (error) {
                console.error(error);
                return error;
            }
            })();
    }
    static async getlocal_fetch_json(path){
        let res = await fetch(path);
        let data = await res.json();
        return data;
    }
    static async getlocal_import(fn, type = 'json'){

    }
}

class NetworkCallStack {
    static CallTrace = {};
    static ObtainUnallocatedUniqueIdentifier(){
        let out = crypto.randomUUID();
        while(NetworkCallStack.CallTrace[out] !== undefined && NetworkCallStack.CallTrace[out] !== null){
            out = crypto.randomUUID();
        }
        return out;
    }
    static Deallocate(index){
        NetworkCallStack.CallTrace[index] = undefined;
        delete NetworkCallStack.CallTrace[index];
    }
    static NetworkJob = class {
        constructor(method, buffer = null, callback = (i, b) => {return null;}, autodeallocate = true){
            this.index = NetworkCallStack.ObtainUnallocatedUniqueIdentifier();
            this.method = method;
            this.buffer = buffer;
            this.callback = callback;
            this.autodeallocate = autodeallocate;
        }
    }
    static DispatchJob([method = null, buffer = null, callback = null, autodeallocate = true]){
        if(method === null){
            return -1;
        }
        let obj;
        if(callback === null){
            obj = new NetworkCallStack.NetworkJob(method, buffer);
        }else{
            obj = new NetworkCallStack.NetworkJob(method, buffer, callback);
        }

        //
        this.CallTrace[obj.index] = obj;
        try{
            NetworkCallStack.Methods[obj.method](obj.index);
        }catch(e){
            console.log(e.msg);
            this.CallTrace[obj.index] = undefined;
            return -1;
        }

        return obj.index;
    }
    static Methods = class {
        static list = [
            "test",
            "fetch_get_text",
            "fetch_get_json",
            
            // "fetch_extensible",
        ];
        static async test(index){
            let link = NetworkCallStack.CallTrace[index];

            let sum = 0;
            for(let i=0;i<link.buffer.length;i++){
                sum += link.buffer[i];
            }

            //return sum;
            link.callback(link.index, sum);
            if(link.autodeallocate){
                NetworkCallStack.Deallocate(link.index);
            }
            return sum;
        }
        static async fetch_get_text(index){
            let link = NetworkCallStack.CallTrace[index];
            let result;

            //
            try {
                const response = await fetch(link.buffer);
                const data = await response.text();
                //console.log(data); //debug
                result = data;
            } catch (error) {
                console.error(error);
                result = error;
            }

            link.callback(link.index, result);
            if(link.autodeallocate){
                NetworkCallStack.Deallocate(link.index);
            }
            return result;
        }
        static async fetch_get_json(index){
            let link = NetworkCallStack.CallTrace[index];
            let result;

            //
            try {
                const response = await fetch(link.buffer);
                const data = await response.json();
                //console.log(data); //debug
                result = data;
            } catch (error) {
                console.error(error);
                result = error;
            }

            link.callback(link.index, result);
            if(link.autodeallocate){
                NetworkCallStack.Deallocate(link.index);
            }
            return result;
        }
        // static async M(index){
        //     let link = NetworkCallStack.CallTrace[index];
        //     let result;

        //     //

        //     link.callback(link.index, result);
        //     return result;
        // }
    }
}

class FDM {
    static NetworkCallStack = NetworkCallStack;
    static reach_test(){
        return "reached.\n";
    }
    static import_test(fn, type = 'json'){
        return import_test(fn, type);
    }
    static getlocal_fetch_text(path){
        return Internal.getlocal_fetch_text(path);
    }
    static getlocal_fetch_json(path){
        return Internal.getlocal_fetch_json(path);
    }
    static getlocal_import(fn, type = 'json'){
        return Internal.getlocal_import(fn, type);
    }
}

globalThis.FDM = FDM; export { FDM }; 