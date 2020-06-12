export class GUIView
{
    constructor()
    {
        // TODO: fetch button elements from document
        // For now, we don't need any?

        // TODO: fetch pattern div
        this.gridDiv = document.getElementById('grid_div');

        // The cell divs are indexed by step index
        // Each cell has an inner and an outer div
        // The outer div reacts to clicks
        // The inner div is the colored part
        this.cellDivs = [];
    }

    setLength(newLen)
    {








    }

    setCell(stepIdx, rowIdx)
    {
        // TODO: wait until later
    }

    // TODO: handler for when a sell is set/clicked?
    // This can wait until we have display working
}
