//CH_TPTR(int) , CH_TREF(int) , BEGIN_BRIFZ , END_BRIFZ , DBUS(bool_np)

class StdBFUtils {
    static Convert_BF_To_XBFPlainText(program_string){
        //this : (program_string : string[BF_I] --> xbf_assembly_string : string[asm_XBF_I .. "\n"])
    }
    static Errors = class {
        static NOT_YET_IMPLEMENTED(){
            let trace = SysLib.ObtainExceptionTraceReport();
            console.warn("[ERROR] StdBFUtils.Errors.NOT_YET_IMPLEMENTED", trace);
            return "ERROR: StdBFUtils.Errors.NOT_YET_IMPLEMENTED\n"+trace+"\n";
        }
    }
}