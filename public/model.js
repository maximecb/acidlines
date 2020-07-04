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
        this.setLengthCbs = [];
        this.setRootCbs = [];
        this.setTempoCbs = [];
        this.selectPatCbs = [];
        this.setLengthCbs = [];
        this.setNoteCbs = [];
        this.setAccentCbs = [];
        this.setShiftCbs = [];
        this.setSlideCbs = [];
        this.setSustainCbs = [];
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

            rootNote: 'C3',

            // Highlighted scale
            scaleName: 'natural minor',

            tempo: 120,

            patterns: [
                {
                    length: 16,
                    notes: Array(16).fill(null),
                    shift: Array(16).fill(0),
                    accent: Array(16).fill(0),
                    slide: Array(16).fill(0),
                    sustain: Array(16).fill(0),
                }
            ],

            // TODO, but keep this for later
            // Track, list of patterns
            //track: []
        }

        this.load(data);
    }

    /// Set the length of the current pattern
    setLength(newLen)
    {
        let pat = this.data.patterns[this.curPat];
        let oldLen = pat.length;

        pat.notes.length = newLen;
        pat.shift.length = newLen;
        pat.accent.length = newLen;
        pat.slide.length = newLen;

        if (newLen > pat.length)
        {
            pat.notes.fill(null, oldLen);
            pat.shift.fill(0, oldLen);
            pat.accent.fill(0, oldLen);
            pat.slide.fill(0, oldLen);
        }

        pat.length = newLen;

        this.setLengthCbs.forEach(cb => cb(newLen, this.getPattern()));
    }

    setRootNote(rootNote)
    {
        this.data.rootNote = rootNote;
        this.setRootCbs.forEach(cb => cb(rootNote));
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

    getAccent(stepIdx)
    {
        return this.data.patterns[this.curPat].accent[stepIdx];
    }

    getSlide(stepIdx)
    {
        return this.data.patterns[this.curPat].slide[stepIdx];
    }

    setNote(stepIdx, note)
    {
        if (note !== null && (note < 0 || note >= 12))
            throw RangeError('invalid note');

        this.data.patterns[this.curPat].notes[stepIdx] = note;

        // Notify the listeners of the update
        this.setNoteCbs.forEach(cb => cb(stepIdx, note));
    }

    setAccent(stepIdx, val)
    {
        // We use 1/0 because it's shorter in JSON format
        val = val? 1:0;
        this.data.patterns[this.curPat].accent[stepIdx] = val;
        this.setAccentCbs.forEach(cb => cb(stepIdx, val));
    }

    setShift(stepIdx, val)
    {
        if (!(val === -1 || val === 0 || val === 1))
            throw RangeError('invalid shift value');

        this.data.patterns[this.curPat].shift[stepIdx] = val;
        this.setShiftCbs.forEach(cb => cb(stepIdx, val));
    }

    setSlide(stepIdx, val)
    {
        // We use 1/0 because it's shorter in JSON format
        val = val? 1:0;
        this.data.patterns[this.curPat].slide[stepIdx] = val;
        this.setSlideCbs.forEach(cb => cb(stepIdx, val));
    }

    setSustain(stepIdx, val)
    {
        // We use 1/0 because it's shorter in JSON format
        val = val? 1:0;
        this.data.patterns[this.curPat].sustain[stepIdx] = val;
        this.setSustainCbs.forEach(cb => cb(stepIdx, val));
    }

    setPlayPos(stepIdx)
    {
        this.curStep = stepIdx;
        this.playPosCbs.forEach(cb => cb(stepIdx));
    }

    regSetLength(cb)
    {
        this.setLengthCbs.push(cb);
    }

    regSetRoot(cb)
    {
        this.setRootCbs.push(cb);
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

    regSetAccent(cb)
    {
        this.setAccentCbs.push(cb);
    }

    regSetShift(cb)
    {
        this.setShiftCbs.push(cb);
    }

    regSetSlide(cb)
    {
        this.setSlideCbs.push(cb);
    }

    regSetSustain(cb)
    {
        this.setSustainCbs.push(cb);
    }

    regPlayPos(cb)
    {
        this.playPosCbs.push(cb);
    }
}
