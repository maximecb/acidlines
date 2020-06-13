export class Controller
{
    constructor(model, view)
    {
        model.regSelectPat((idx, pat) => view.selectPat(idx, pat));
        model.regSetLength(l => view.setLength(l));

        function noteClick(stepIdx, noteIdx)
        {
            let curNote = model.getNote(stepIdx);

            console.log(stepIdx, noteIdx);
            console.log(curNote, noteIdx);

            if (curNote == noteIdx)
                model.setNote(stepIdx, null);
            else
                model.setNote(stepIdx, noteIdx);
        }

        // Note update callbacks
        view.regNoteClick(noteClick);
        model.regSetNote((stepIdx, noteIdx) => view.setNote(stepIdx, noteIdx));






    }
}
