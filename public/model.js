export class Model
{
    constructor()
    {
        // Patterns data and current scale/root
        this.data = null;

        // Currently selected pattern
        this.curPat = 0;

        // Current playback position, in seconds
        this.playPos = null;

        // Callbacks
        this.selectPatCbs = [];
        this.setLengthCbs = [];
        this.setStepCbs = [];
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
            scaleName: 'natural minor',
            rootNote: 'C3',

            patterns: [
                {
                    length: 8,
                    notes: [null, null, null, null, null, null, null, null],
                    shift: [0, 0, 0, 0, 0, 0, 0, 0],
                    accent: [0, 0, 0, 0, 0, 0, 0, 0],
                }
            ],

            // TODO, but keep this for later
            // Track, list of patterns
            //track: []
        }

        this.load(data);
    }

    selectPat(patIdx)
    {
        if (patIdx >= this.data.patterns.length)
            throw RangeError('invalid pattern index');

        this.curPat = patIdx;

        let pat = this.data.patterns[patIdx];

        // Notify relevant update callbacks
        this.selectPatCbs.forEach(cb => cb(patIdx));
        this.setLengthCbs.forEach(cb => cb(pat.length));

        // Update all steps
        for (let i = 0; i < pat.length; ++i)
        {
            this.setStepCbs.forEach(cb => cb(i, pat.notes[i]));

            // TODO:
            //accent, shift
        }
    }

    setStep(stepIdx, rowIdx)
    {
        let pat = this.data.patterns[this.curPat];

        if (stepIdx >= pat.length)
            throw RangeError('invalid step index');

        pat.notes[stepIdx] = rowIdx;

        this.setStepCbs.forEach(cb => cb(stepIdx, rowIdx));
    }

    //setAccent()
    //setShift()
    //setTempo()

    regSelectPat(cb)
    {
        this.selectPatCbs.append(cb);
    }

    regSetLength(cb)
    {
        this.setLengthCbs.append(cb);
    }

    regSetStep(cb)
    {
        this.setStepCbs.append(cb);
    }
}
