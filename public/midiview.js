import * as music from './music.js';
import * as midi from './midi.js';

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

        // Callbacks for then the playback position is updated
        this.playPosCbs = []
    }

    /// Start playback
    play()
    {
        // If playback already started, stop first
        if (this.updInterv)
            this.stop();

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
            let timeToStep = nextStepPos - pos

            // If it's not time to send the next note
            if (timeToStep > 25)
                return;

            // Get the current note
            let stepIdx = nextStep % this.pat.length;
            let note = this.pat.notes[stepIdx];

            // Set the playback position when the note is playing
            let updateCb = () => this.playPosCbs.forEach(cb => cb(stepIdx));
            this.posInterv = setTimeout(updateCb, timeToStep);

            // Move on to the next step
            nextStep++;

            // If this note not quiet
            if (note === null)
                return;

            // Compute the note number
            let noteNo = note + this.rootNote;

            // Time at which to send the note on and off
            let onTime = nextStepPos + playStart;
            let offTime = onTime + stepLen - 1;

            console.log(noteNo);

            let noteOn = midi.noteOn(noteNo);
            let noteOff = midi.noteOff(noteNo);
            midi.sendAll(noteOn, onTime);
            midi.sendAll(noteOff, offTime);
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
        this.updInterv = setInterval(update, 25);
    }

    stop()
    {
        if (!this.updInterv)
            return;

        // Stop updating the playback
        clearInterval(this.updInterv);

        // Stop updating the playback position
        clearInterval(this.posInterv);

        // Clear the playback position
        this.playPosCbs.forEach(cb => cb(null));
    }

    setPattern(pat)
    {
        this.pat = pat;
    }

    setTempo(tempo)
    {
        this.tempo = tempo;
    }

    regPlayPos(cb)
    {
        this.playPosCbs.push(cb);
    }
}
