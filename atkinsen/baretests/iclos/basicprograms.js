{
    //GoogleShuffleNetwork Information Center Lookup
    class GSNICReader {
        static frame(buffer){
            BIOS.Print("gs");
        }
    }
    BasicPrograms["GSNICReader"] = GSNICReader;
    BootStrap.Registration.Register( //debug
        new BootStrap.Registration.ExtShell(
            "gsnic_viewer",
            BasicPrograms.GSNICReader,
            "frame",
            ["frame",] ,
            false, //
            "GSNIC Database Reader\n"// "X"//no
        )
    );
}