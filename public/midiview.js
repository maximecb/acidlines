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
            let tempo = this.tempo;
            let pat = this.pat;

            // Compute the duration in seconds of one step in milliseconds
            let stepLen = 1000 * 60 / (4 * tempo);

            // Compute the current time in milliseconds
            let time = performance.now();
            let pos = time - playStart;

            // Compute the time until the next step should be played
            let timeToStep = nextStepPos - pos

            // If it's not time to send the next note, stop
            if (timeToStep > 25)
                return;

            // Get the next note to be sent
            let stepIdx = nextStep % this.pat.length;
            let nextStep = (nextStep + 1) % this.pat.length;
            let note = this.pat.notes[stepIdx];
            let shift = this.pat.shift[stepIdx];
            let slide = this.pat.slide[stepIdx];
            let accent = this.pat.accent[stepIdx];
            let sustain = this.pat.sustain[stepIdx];
            let nextSustain = this.pat.sustain[nextStep];

            // Set the playback position when the note is playing
            let updateCb = () => this.playPosCbs.forEach(cb => cb(stepIdx));
            this.posInterv = setTimeout(updateCb, timeToStep);

            // Move on to the next step
            nextStep++;

            // Compute the position of the next step to be sent
            nextStepPos = nextStepPos + stepLen;

            // If this note not quiet
            if (note === null)
                return;

            // Compute the note number
            let noteNo = note + this.rootNote + 12 * shift;

            // Time at which to send the note on and off
            // To signal a slide through MIDI, we overlap with the next note
            let onTime = nextStepPos + playStart;
            let offTime = onTime + (slide? (stepLen + 20):(stepLen - 20));

            // The accent determines the velocity
            let vel = accent? 127:63;

            console.log(noteNo);

            // If sustain is on cur the current step, don't send a note-on
            if (sustain)
                midi.sendAll(midi.noteOn(noteNo, vel), onTime);

            // If sustain is on for the next step, don't send a note-off
            if (nextSustain)
                midi.sendAll(midi.noteOff(noteNo), offTime);
        }

        // Bind the update function to this object
        update = update.bind(this);

        // Store the time playback started
        let playStart = performance.now();

        // Next step to be sent
        let nextStep = 0;

        // Time at which the next step should be sent
        let nextStepPos = 0;

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

    setRootNote(rootNote)
    {
        this.rootNote = music.Note(rootNote).noteNo
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
