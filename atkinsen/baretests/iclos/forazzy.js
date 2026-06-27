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
            static FillRule = class {
                constructor(){ // Define how a frame should appear on the screen (fill previous, fill screen, float-fill previous, float-fill screen, static positioning, etc.)
                    //
                }
            }
            constructor(){
                this.render_routines = [];
                this.fill_rule;
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
    BasicPrograms["forazzy"] = __forazzy;
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