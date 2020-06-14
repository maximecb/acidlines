export class MIDIView
{
    constructor()
    {
        // Current pattern being played
        this.pat = null;
    }

    /// Start playback
    play()
    {
        function update()
        {
            console.log('update');

            let time = performance.now();
            let pos = time - playStart;





        }

        console.log('MIDIView.play()');

        // Store the time playback started
        let playStart = performance.now();

        update();

        // Schedule regular updates
        this.interv = setInterval(update, 30);
    }

    stop()
    {
        if (!this.interv)
            return;

        clearInterval(this.interv);
    }

    setPattern(pat)
    {
        this.pat = pat;
    }






}
