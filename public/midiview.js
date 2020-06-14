export class MIDIView
{
    constructor()
    {
        // Current pattern being played
        this.pat = null;

        // Time at which playback was started
        this.playStart = null;
    }

    /// Start playback
    play()
    {
        console.log('MIDIView.play()');

        // Store the time playback started
        this.playStart = performance.now();

        // TODO: schedule a timer interval?




    }

    setPattern(pat)
    {
        this.pat = pat;
    }






}
