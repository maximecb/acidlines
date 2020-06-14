export class Controller
{
    constructor(model, view)
    {
        // Note clicked in the view
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

        // Play clicked in the view
        function play()
        {
            console.log('play');





        }

        model.regSelectPat((idx, pat) => view.selectPat(idx, pat));
        model.regSetLength(l => view.setLength(l));

        // Note update callbacks
        view.regNoteClick(noteClick);
        model.regSetNote((stepIdx, noteIdx) => view.setNote(stepIdx, noteIdx));

        // Play/stop
        view.regPlay(play);






    }
}
