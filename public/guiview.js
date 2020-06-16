import * as music from './music.js';

const numRows = 12;
const onColor = 'rgb(255, 0, 0)';
const offColor = 'rgb(150, 0, 0)';
const highColor = 'rgb(255, 255, 255)';

export class GUIView
{
    constructor()
    {
        this.selectRoot = document.getElementById('select_root');
        this.btnPlay = document.getElementById('btn_play');
        this.btnStop = document.getElementById('btn_stop');
        this.bpmSlider = document.getElementById('bpm_slider');
        this.bpmDisplay = document.getElementById('bpm_display');

        // Fetch the pattern div
        this.patDiv = document.getElementById('pat_div');

        // The cell divs are indexed by step index
        this.cellDivs = [];

        // Currently highlighted step
        this.playPos = null;

        // Callbacks that can be registered on the GUI view
        this.noteClickCbs = [];
        this.playCbs = [];
        this.stopCbs = [];
        this.rootCbs = [];
        this.tempoCbs = []

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
            let selectIdx = this.selectRoot.selectedIndex;
            let scaleRoot = this.selectRoot.options[selectIdx].value;
            this.rootCbs.forEach(cb => cb(scaleRoot));
        }

        // Connect the UI elements to callbacks
        this.selectRoot.onchange = rootChange.bind(this);
        this.btnPlay.onclick = () => this.playCbs.forEach(cb => cb());
        this.btnStop.onclick = () => this.stopCbs.forEach(cb => cb());
        this.bpmSlider.oninput = () => this.tempoCbs.forEach(cb => cb(this.bpmSlider.value));
    }

    selectPat(patIdx, patData)
    {
        var numSteps = patData.length;
        var numBars = Math.ceil(numSteps / 16);

        let view = this;

        function makeCell(stepIdx, noteIdx, cellOn)
        {
            // The outer cell div is the element reacting to clicks
            // It's larger and therefore easier to click
            var cell = document.createElement('div');
            cell.style['display'] = 'inline-block';

            // The inner div is the colored/highlighted element
            var inner = document.createElement('div');
            inner.style['display'] = 'inline-block';
            inner.style['width'] = '14px';
            inner.style['height'] = '14px';
            inner.style['margin'] = '2px';
            inner.style['margin-left'] = (stepIdx%4 == 0)? '3px':'2px';
            inner.style['margin-right'] = (stepIdx%4 == 3)? '3px':'2px';
            inner.style['background-color'] = cellOn? onColor:offColor;
            cell.appendChild(inner);

            // Store a reference to the inner div
            view.cellDivs[stepIdx][noteIdx] = inner;

            // Notify the callback when this cell is clicked
            let callCb = cb => cb(stepIdx, noteIdx);
            cell.onclick = () => view.noteClickCbs.forEach(callCb);

            return cell;
        }

        function makeBar(barIdv)
        {
            var bar = document.createElement('div');
            bar.style['display'] = 'inline-block';
            bar.style['margin'] = '0px 2px';

            for (var j = 0; j < numRows; ++j)
            {
                var row = document.createElement('div');

                for (var i = 0; i < 16; ++i)
                {
                    var stepIdx = barIdx * 16 + i;
                    let cellOn = (patData.notes[stepIdx] === j);
                    var cell = makeCell(stepIdx, numRows - j - 1, cellOn);
                    row.appendChild(cell);
                }

                bar.appendChild(row);
            }

            return bar;
        }

        // Remove the old bar divs
        while (this.patDiv.firstChild)
            this.patDiv.firstChild.remove();

        // Clear the cell divs arrays
        for (let i = 0; i < numSteps; ++i)
            this.cellDivs[i] = [];

        for (var barIdx = 0; barIdx < numBars; ++barIdx)
        {
            var barDiv = document.createElement('div');
            barDiv.style['display'] = 'inline-block';
            this.patDiv.appendChild(barDiv);

            var bar = makeBar(barIdx);
            barDiv.appendChild(bar);

            // If this is not the last bar, add a separator
            if (barIdx < numBars - 1)
            {
                var barHeight = numRows * 18;
                var sep = document.createElement('div');
                sep.style['display'] = 'inline-block';
                sep.style['width'] = '3px';
                sep.style['height'] = (barHeight - 4) + 'px';
                sep.style['background'] = '#900';
                sep.style['margin'] = '2px 1px';
                barDiv.appendChild(sep);
            }
        }
    }

    /// Set the note index for a given step
    setNote(stepIdx, noteIdx)
    {
        console.log('view.setNote', stepIdx, noteIdx);

        let col = this.cellDivs[stepIdx];

        // For each cell in this column
        for (let i = 0; i < col.length; ++i)
        {
            let cellOn = (noteIdx === i);
            col[i].style['background-color'] = cellOn? onColor:offColor;
        }
    }

    /// Highlight the currently playing note
    setPlayPos(stepIdx)
    {
        // Need to un-highlight previous play position
        if (this.playPos !== null)
        {
            // For each cell in this column
            let col = this.cellDivs[this.playPos];
            for (let i = 0; i < col.length; ++i)
            {
                let curColor = col[i].style['background-color'];
                let cellHigh = curColor == highColor;
                col[i].style['background-color'] = cellHigh? onColor:curColor;
            }
        }

        // Highlight the new play position
        if (stepIdx !== null)
        {
            // For each cell in this column
            let col = this.cellDivs[stepIdx];
            for (let i = 0; i < col.length; ++i)
            {
                let curColor = col[i].style['background-color'];
                let cellOn = curColor == onColor;
                col[i].style['background-color'] = cellOn? highColor:curColor;
            }
        }

        console.log('playPos: ', stepIdx);

        this.playPos = stepIdx;
    }

    /// Set the length of the pattern
    setLength(newLen)
    {
        if (newLen == this.cellDivs.length)
            return;

        throw TypeError('not yet implemented');
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

    regPlay(cb)
    {
        this.playCbs.push(cb);
    }

    regStop(cb)
    {
        this.stopCbs.push(cb);
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
