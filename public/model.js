export class Model
{
    constructor()
    {
        // Patterns data and current scale/root
        // Plain JSON object that can be shared/persisted
        this.data = null;

        // Currently selected pattern
        this.curPat = 0;

        // Currently playing step
        this.curStep = null;

        // Callbacks
        this.setTempoCbs = [];
        this.selectPatCbs = [];
        this.setLengthCbs = [];
        this.setNoteCbs = [];
        this.playPosCbs = [];
    }

    load(data)
    {
        this.data = data;

        // Call selectPat to notify the callbacks
        this.selectPat(0)
    }

    new()
    {
        let data = {
            title: 'Untitled Project',

            scaleName: 'natural minor',
            rootNote: 'C3',

            tempo: 120,

            patterns: [
                {
                    length: 16,
                    notes: Array(16).fill(null),
                    shift: Array(16).fill(0),
                    accent: Array(16).fill(0),
                    slide: Array(16).fill(0),
                }
            ],

            // TODO, but keep this for later
            // Track, list of patterns
            //track: []
        }

        this.load(data);
    }

    setTempo(tempo)
    {
        this.data.tempo = tempo;
        this.setTempoCbs.forEach(cb => cb(tempo));
    }

    /// Get a copy of the current pattern data
    getPattern()
    {
        let pat = this.data.patterns[this.curPat];

        return {
            length: pat.length,
            notes: [...pat.notes],
            shift: [...pat.shift],
            accent: [...pat.accent],
            slide: [...pat.slide],
        };
    }

    selectPat(patIdx)
    {
        if (patIdx >= this.data.patterns.length)
            throw RangeError('invalid pattern index');

        this.curPat = patIdx;

        // Notify relevant update callbacks
        this.selectPatCbs.forEach(cb => cb(patIdx, this.getPattern()));
    }

    getNote(stepIdx)
    {
        return this.data.patterns[this.curPat].notes[stepIdx];
    }

    setNote(stepIdx, note)
    {
        if (note !== null && (note < 0 || note >= 12))
            throw RangeError('invalid note');

        this.data.patterns[this.curPat].notes[stepIdx] = note;

        // Notify the listeners of the update
        this.setNoteCbs.forEach(cb => cb(stepIdx, note));
    }

    setPlayPos(stepIdx)
    {
        this.curStep = stepIdx;
        this.playPosCbs.forEach(cb => cb(stepIdx));
    }

    regSetTempo(cb)
    {
        this.setTempoCbs.push(cb);
    }

    regSelectPat(cb)
    {
        this.selectPatCbs.push(cb);
    }

    regSetLength(cb)
    {
        this.setLengthCbs.push(cb);
    }

    regSetNote(cb)
    {
        this.setNoteCbs.push(cb);
    }

    regPlayPos(cb)
    {
        this.playPosCbs.push(cb);
    }
}
