let __forazzy;
{
    class InputMultiplexer {
        static frames = [

        ];
        static Frame = class {
            static RenderRoutine = class {
                //Context for a RenderRoutine execution object: (todo --)
                constructor(){
                    //
                }
            }
            constructor(){
                this.render_routines = [];
            }
        }
    }
    class Foraz {
        static init(total = false){

        }
        static frame(){
            BIOS.Print("Reached.\n");
            BootStrap.FrameUIServer.RestartSubroutine.reboot();
        }
    }
    __forazzy = Foraz;
    BasicPrograms["forazzy"] = forazzy;
    BootStrap.Registration.Register(
        new BootStrap.Registration.ExtShell(
            "forazzy",
            BasicPrograms.forazzy,
            "frame",
            ["frame",],
            false,
            "Games / Apps | Primary Graphical User Interface Research Base"
        )
    );
    Foraz.init(true);
}