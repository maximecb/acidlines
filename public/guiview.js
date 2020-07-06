import * as music from './music.js';

const numRows = 12;

class Cell
{
    constructor(cssPrefix, stepIdx, rowIdx, cbList)
    {
        // CSS class name prefix
        this.cssPrefix = cssPrefix;

        // Current cell state, on/off and highlighting
        this.val = false;
        this.light = false;

        // The outer cell div is the element reacting to clicks
        // It's larger and therefore easier to click
        this.cellDiv = document.createElement('div');
        this.cellDiv.style['display'] = 'inline-block';

        // The inner div is the colored/highlighted element
        this.innerDiv = document.createElement('div');
        this.innerDiv.style['margin-left'] = (stepIdx%4 == 0)? '3px':'2px';
        this.innerDiv.style['margin-right'] = (stepIdx%4 == 3)? '3px':'2px';
        this._setClassName();
        this.cellDiv.appendChild(this.innerDiv);

        function noteClick()
        {
            cbList.forEach(cb => cb(stepIdx, rowIdx));
        }

        this.cellDiv.onclick = noteClick;
    }

    _setClassName()
    {
        if (this.light && this.on)
            this.innerDiv.className = this.cssPrefix + ' ' + this.cssPrefix + '_light';
        else if (this.on)
            this.innerDiv.className = this.cssPrefix + ' ' + this.cssPrefix + '_on';
        else
            this.innerDiv.className = this.cssPrefix
    }

    setState(v)
    {
        this.on = v;
        this._setClassName();
    }

    setLight(v)
    {
        this.light = v;
        this._setClassName();
    }
}

export class GUIView
{
    constructor()
    {
        this.patLength = document.getElementById('pat_length');
        this.selectRoot = document.getElementById('select_root');
        this.btnPlay = document.getElementById('btn_play');
        this.btnStop = document.getElementById('btn_stop');
        this.bpmSlider = document.getElementById('bpm_slider');
        this.bpmDisplay = document.getElementById('bpm_display');

        // Fetch the pattern div
        this.patDiv = document.getElementById('pat_div');

        // The cells are indexed by step index
        this.noteCells = [];
        this.slideCells = [];
        this.shiftCells = [];
        this.accentCells = [];
        this.sustainCells = [];

        // Currently playing/highlighted step (null if not playing)
        this.playPos = null;

        // Callbacks that can be registered on the GUI view
        this.noteClickCbs = [];
        this.slideClickCbs = [];
        this.shiftClickCbs = [];
        this.accentClickCbs = [];
        this.sustainClickCbs = [];
        this.playCbs = [];
        this.stopCbs = [];
        this.lengthCbs = [];
        this.rootCbs = [];
        this.tempoCbs = []

        function lengthChange()
        {
            let newLen = Number(this.patLength.value);

            if (isNaN(newLen) || newLen < 1)
                newLen = 1;

            this.patLength.value = newLen;
            this.lengthCbs.forEach(cb => cb(newLen));
        }

        // Populate the root note selection
        var rootNote = music.Note('C1');
        for (let i = 0; i < 5 * music.NOTES_PER_OCTAVE; ++i)
        {
            var noteName = rootNote.getName();
            var opt = document.createElement("option");
            opt.setAttribute('value', noteName);
            opt.appendChild(document.createTextNode(noteName));
            opt.selected = (noteName == 'C3');
            this.selectRoot.appendChild(opt);
            rootNote = rootNote.offset(1);
        }

        function rootChange()
        {
            let scaleRoot = this.getRootNote();
            this.rootCbs.forEach(cb => cb(scaleRoot));
        }

        function keyDown(event)
        {
            // If a text input box is focused, do nothing
            if (document.activeElement &&
                document.activeElement.nodeName.toLowerCase() == "input")
                return;

            // Make the space key trigger play/stop
            if (event.keyCode == 0x20)
            {
                if (this.playPos === null)
                {
                    console.log('playing');
                    this.playCbs.forEach(cb => cb());
                }
                else
                {
                    console.log('stopping');
                    this.stopCbs.forEach(cb => cb());
                }

                event.stopPropagation();
                event.preventDefault();
            }
        }

        // Connect the UI elements to callbacks
        this.patLength.onchange = lengthChange.bind(this);
        this.selectRoot.onchange = rootChange.bind(this);
        this.btnPlay.onclick = () => this.playCbs.forEach(cb => cb());
        this.btnStop.onclick = () => this.stopCbs.forEach(cb => cb());
        this.bpmSlider.oninput = () => this.tempoCbs.forEach(cb => cb(this.bpmSlider.value));
        window.addEventListener('keydown', keyDown.bind(this));
    }

    selectPat(patIdx, patData)
    {
        let numSteps = patData.length;
        let numBars = Math.ceil(numSteps / 16);
        let numFullBars = Math.floor(numSteps / 16);
        let rootNote = music.Note(this.getRootNote());

        let view = this;

        function makeRowNames()
        {
            let div = document.createElement('div');
            div.style['display'] = 'inline-block';
            div.style['vertical-align'] = 'top';
            div.style['margin'] = '0px 2px';

            let names = [];

            // For each row/note, in decreasing order
            for (let rowIdx = numRows - 1; rowIdx >= 0; rowIdx--)
            {
                let noteName = rootNote.offset(rowIdx).getName();
                names.push(noteName);
            }

            names = names.concat(['up', 'down', 'accent', 'slide', 'sustain']);

            for (let name of names)
            {
                let rowCont = document.createElement('div');
                rowCont.className = 'row_name_cont';

                let rowText = document.createElement('div');
                rowText.className = 'row_name_text';
                rowText.innerHTML = name;
                rowCont.appendChild(rowText);

                div.appendChild(rowCont);
            }

            return div;
        }

        function makeBar(barIdx, barLen)
        {
            var bar = document.createElement('div');
            bar.style['display'] = 'inline-block';
            bar.style['margin'] = '0px 2px';

            // For each row/note, in decreasing order
            for (var rowIdx = numRows - 1; rowIdx >= 0; rowIdx--)
            {
                var row = document.createElement('div');

                for (var i = 0; i < barLen; ++i)
                {
                    let stepIdx = barIdx * 16 + i;
                    let cell = new Cell('note', stepIdx, rowIdx, view.noteClickCbs);
                    row.appendChild(cell.cellDiv);
                    view.noteCells[stepIdx][rowIdx] = cell;
                }

                bar.appendChild(row);
            }

            // Create the shift cells
            var upRow = document.createElement('div');
            var dnRow = document.createElement('div');
            for (var i = 0; i < barLen; ++i)
            {
                let stepIdx = barIdx * 16 + i;
                let upCell = new Cell('shiftup', stepIdx, +1, view.shiftClickCbs);
                let dnCell = new Cell('shiftdn', stepIdx, -1, view.shiftClickCbs);
                upRow.appendChild(upCell.cellDiv);
                dnRow.appendChild(dnCell.cellDiv);
                view.shiftCells[stepIdx][1] = upCell;
                view.shiftCells[stepIdx][0] = dnCell;
            }
            bar.appendChild(upRow);
            bar.appendChild(dnRow);

            // Create the accent cells
            var row = document.createElement('div');
            for (var i = 0; i < barLen; ++i)
            {
                let stepIdx = barIdx * 16 + i;
                let cell = new Cell('accent', stepIdx, 0, view.accentClickCbs);
                row.appendChild(cell.cellDiv);
                view.accentCells[stepIdx] = cell;
            }
            bar.appendChild(row);

            // Create the slide cells
            var row = document.createElement('div');
            for (var i = 0; i < barLen; ++i)
            {
                let stepIdx = barIdx * 16 + i;
                let cell = new Cell('slide', stepIdx, 0, view.slideClickCbs);
                row.appendChild(cell.cellDiv);
                view.slideCells[stepIdx] = cell;
            }
            bar.appendChild(row);

            // Create the sustain cells
            var row = document.createElement('div');
            for (var i = 0; i < barLen; ++i)
            {
                let stepIdx = barIdx * 16 + i;
                let cell = new Cell('sustain', stepIdx, 0, view.sustainClickCbs);
                row.appendChild(cell.cellDiv);
                view.sustainCells[stepIdx] = cell;
            }
            bar.appendChild(row);

            return bar;
        }

        // Remove the old bar divs
        while (this.patDiv.firstChild)
        {
            this.patDiv.firstChild.remove();
        }

        // Clear the cell divs arrays
        for (let i = 0; i < numSteps; ++i)
        {
            this.noteCells[i] = [];
            this.shiftCells[i] = []
        }

        // Create the row names
        this.patDiv.appendChild(makeRowNames());

        // For each bar
        for (var barIdx = 0; barIdx < numBars; ++barIdx)
        {
            var barDiv = document.createElement('div');
            barDiv.style['display'] = 'inline-block';
            this.patDiv.appendChild(barDiv);

            let barLen = (barIdx >= numFullBars)? (numSteps % 16):16;
            var bar = makeBar(barIdx, barLen);
            barDiv.appendChild(bar);

            // If this is not the last bar, add a separator
            if (barIdx < numBars - 1)
            {
                var barHeight = (numRows + 5) * 18;
                var sep = document.createElement('div');
                sep.style['display'] = 'inline-block';
                sep.style['width'] = '3px';
                sep.style['height'] = (barHeight - 4) + 'px';
                sep.style['background'] = '#900';
                sep.style['margin'] = '2px 1px';
                barDiv.appendChild(sep);
            }
        }

        // Set the cell states from the pattern data
        for (let stepIdx = 0; stepIdx < numSteps; ++stepIdx)
        {
            this.setNote(stepIdx, patData.notes[stepIdx]);
            this.setAccent(stepIdx, patData.accent[stepIdx]);
            this.setShift(stepIdx, patData.shift[stepIdx]);
            this.setSlide(stepIdx, patData.slide[stepIdx]);
            this.setSustain(stepIdx, patData.sustain[stepIdx]);
        }
    }

    // Get the currently selected root note
    getRootNote()
    {
        let selectIdx = this.selectRoot.selectedIndex;
        let scaleRoot = this.selectRoot.options[selectIdx].value;
        return scaleRoot;
    }

    /// Set the note index for a given step
    setNote(stepIdx, noteIdx)
    {
        console.log('view.setNote', stepIdx, noteIdx);

        // For each cell in this column
        let col = this.noteCells[stepIdx];
        for (let i = 0; i < col.length; ++i)
        {
            col[i].setState(noteIdx === i);
        }
    }

    /// Set the accent for a given step
    setAccent(stepIdx, val)
    {
        this.accentCells[stepIdx].setState(val);
    }

    /// Set the shift for a given step
    setShift(stepIdx, val)
    {
        let upOn = (val == 1);
        let dnOn = (val == -1);
        this.shiftCells[stepIdx][1].setState(upOn);
        this.shiftCells[stepIdx][0].setState(dnOn);
    }

    /// Set the slide for a given step
    setSlide(stepIdx, val)
    {
        this.slideCells[stepIdx].setState(val);
    }

    /// Set the sustain for a given step
    setSustain(stepIdx, val)
    {
        this.sustainCells[stepIdx].setState(val);
    }

    /// Highlight the currently playing note
    setPlayPos(stepIdx)
    {
        // Need to un-highlight previous play position
        if (this.playPos !== null)
        {
            // For each cell in this column
            let col = this.noteCells[this.playPos];
            for (let i = 0; i < col.length; ++i)
            {
                col[i].setLight(false);
            }
        }

        // Highlight the new play position
        if (stepIdx !== null)
        {
            // For each cell in this column
            let col = this.noteCells[stepIdx];
            for (let i = 0; i < col.length; ++i)
            {
                col[i].setLight(true);
            }
        }

        this.playPos = stepIdx;
    }

    setRootNote(rootNote)
    {
        // Find the option to select
        for (let i = 0; i < this.selectRoot.options.length; ++i)
        {
            if (this.selectRoot.options[i].value == rootNote)
            {
                this.selectRoot.selectedIndex = i;
                return;
            }
        }

        throw RangeError('invalid root note');
    }

    setTempo(tempo)
    {
        this.bpmSlider.value = tempo;
        this.bpmDisplay.innerHTML = tempo;
    }

    /// Handler for when a note grid cell is clicked
    regNoteClick(cb)
    {
        this.noteClickCbs.push(cb);
    }

    /// Handler for when an accent grid cell is clicked
    regAccentClick(cb)
    {
        this.accentClickCbs.push(cb);
    }

    /// Handler for when a shift grid cell is clicked
    regShiftClick(cb)
    {
        this.shiftClickCbs.push(cb);
    }

    /// Handler for when a slide grid cell is clicked
    regSlideClick(cb)
    {
        this.slideClickCbs.push(cb);
    }

    /// Handler for when a sustain grid cell is clicked
    regSustainClick(cb)
    {
        this.sustainClickCbs.push(cb);
    }

    regPlay(cb)
    {
        this.playCbs.push(cb);
    }

    regStop(cb)
    {
        this.stopCbs.push(cb);
    }

    // Handler for when the pattern length is changed
    regLength(cb)
    {
        this.lengthCbs.push(cb);
    }

    // Handler for when the root note is changed
    regRoot(cb)
    {
        this.rootCbs.push(cb);
    }

    // Handler for when the tempo is changed
    regTempo(cb)
    {
        this.tempoCbs.push(cb);
    }
}
