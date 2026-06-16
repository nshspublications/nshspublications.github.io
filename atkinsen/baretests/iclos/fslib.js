class fslib {
    static DBFS = class { //simple entry fs, no directories
        constructor(){
            this.drive = [];
        }
    }
    static ITreeFS = class { //more complex/realistic fs, tree node structure
        constructor(){
            this.drive = [];
        }
    }
}