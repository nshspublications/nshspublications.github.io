let __idialer;
{
    __idialer = class {
        static DBG_KICK = true;
        static frame(){
            if(DebugIO.SORRY_IF_SORRY(this.DBG_KICK)){
                // BIOS.Print("Sorry\n--DBG_KICK.\n");
                // BootStrap.FrameUIServer.RestartSubroutine.reboot();
                // Debug
                BIOS.Print("This application does not yet function.\n");
                return;
            }
            //
        }
    };
    BasicPrograms['idialer'] = __idialer;
    BootStrap.Registration.Register(
        new BootStrap.Registration.ExtShell(
            "idialer",
            BasicPrograms.idialer,
            "frame",
            ["frame",],
            false,
            "Basic Internet Packet Fetch Interface\n" //DON'T FORGET THE \n !!! !!!
        )
    );
}