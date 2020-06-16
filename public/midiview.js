import * as music from './music.js';

export class MIDIView
{
    constructor()
    {
        // Current pattern being played
        this.pat = null;

        // Current tempo
        this.tempo = 120;

        // Root note number
        this.rootNote = music.Note('C3').noteNo;
    }

    /// Start playback
    play()
    {
        function update()
        {
            //console.log('update');

            let tempo = this.tempo;
            let pat = this.pat;

            // Compute the duration in seconds of one step in milliseconds
            let stepLen = 1000 * 60 / (4 * tempo);

            // Compute the current time in milliseconds
            let time = performance.now();
            let pos = time - playStart;

            // Compute the position of the next step to be sent
            let nextStepPos = nextStep * stepLen;

            // If it's not time to send the next note
            if (nextStepPos - pos > 25)
                return;

            // Get the current note
            let note = this.pat.notes[nextStep % this.pat.length];

            // Move on to the next step
            nextStep++;

            // If this note not quiet
            if (note === null)
                return;

            // Compute the note number
            let noteNo = note + this.rootNote;

            // Time at which to send the note
            let sendTime = nextStepPos + playStart;

            console.log(noteNo);






        }

        // Bind the update function to this object
        update = update.bind(this);

        console.log('MIDIView.play()');

        // Store the time playback started
        let playStart = performance.now();

        // Next step to be sent
        let nextStep = 0;

        update();

        // Schedule regular updates
        this.interv = setInterval(update, 25);
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

    setTempo(tempo)
    {
        this.tempo = tempo;
    }
}
