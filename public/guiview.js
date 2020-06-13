export class GUIView
{
    constructor()
    {
        // TODO: fetch button elements from document
        // For now, we don't need any?

        // Fetch the pattern div
        this.patDiv = document.getElementById('pat_div');

        // The cell divs are indexed by step index
        this.cellDivs = [];
    }

    selectPat(patIdx, patData)
    {
        const numRows = 12;
        const onColor = 'rgb(255,0,0)';
        const offColor = 'rgb(150,0,0)';

        var numSteps = patData.length;
        var numBars = Math.ceil(numSteps / 16);

        let cellDivs = this.cellDivs;

        function makeCell(i, j, cellOn)
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
            inner.style['margin-left'] = (i%4 == 0)? '3px':'2px';
            inner.style['margin-right'] = (i%4 == 3)? '3px':'2px';
            inner.style['background-color'] = cellOn? onColor:offColor;
            cell.appendChild(inner);

            console.log(i, j);
            console.log(cellDivs);
            cellDivs[i][j] = inner;

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

    setLength(newLen)
    {
        if (newLen == this.cellDivs.length)
            return;

        throw TypeError('not yet implemented');
    }

    setCell(stepIdx, rowIdx)
    {
        // TODO: wait until later
    }

    // TODO: handler for when a sell is set/clicked?
    // This can wait until we have display working
}
