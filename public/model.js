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
        this.patSelectCbs = [];
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

    // TODO: methods to mutate the state
    // Start with just setStep, so we can quickly do some basic testing

    selectPat(patIdx)
    {
        if (patIdx >= this.data.patterns.length)
            throw RangeError('invalid pattern index');

        this.curPat = patIdx;


        // TODO: notify relevant update callbacks
        // set current pattern
        // set pattern length
        // update all steps





    }

    setStep(stepIdx, rowIdx)
    {
        let pat = this.data.patterns[this.curPat];

        if (stepIdx >= pat.length)
            throw RangeError('invalid step index');

        pat.notes[stepIdx] = rowIdx;


        // TODO: callback






    }

    //setAccent()
    //setShift()
    //setTempo()

    regPatSelect(cb)
    {
        this.patSelectCbs.append(cb);
    }

    regSetLength(cb)
    {
        this.setLengthCbs.append(cb);
    }

    regStepSet(cb)
    {
        this.stepSetCbs.append(cb);
    }
}
