let __vibetest;

{
    class VibeTest {
        static frame(){

        }
    }
    __vibetest = VibeTest;
    BasicPrograms["vibetest"] = __vibetest;
    BootStrap.Registration.Register(
        new BootStrap.Registration.ExtShell(
            "vibetest",
            BasicPrograms.vibetest,
            "frame",
            ["frame",],
            true,
            "FLASHING LIGHTS WARNING! Vibration & Accelerometer Test"
        )
    );
}