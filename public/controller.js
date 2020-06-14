export class Controller
{
    constructor(model, guiView, midiView)
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

        // Play button clicked
        function play()
        {
            midiView.play();

            // TODO: grey out or hide play button
        }

        // Stop button clicked
        function stop()
        {
            midiView.stop();
        }

        // Callback to update the midi view's pattern data
        let updateMidi = () => midiView.setPattern(model.getPattern);

        // Tempo changed
        guiView.regTempo(tempo => model.setTempo(tempo));
        //model.regSetTempo(tempo => guiView.setTempo(tempo));
        model.regSetTempo(tempo => midiView.setTempo(tempo));

        model.regSelectPat((idx, pat) => guiView.selectPat(idx, pat));
        model.regSelectPat(updateMidi);

        model.regSetLength(l => guiView.setLength(l));
        model.regSetLength(updateMidi);

        // Note update callbacks
        guiView.regNoteClick(noteClick);
        model.regSetNote((stepIdx, noteIdx) => guiView.setNote(stepIdx, noteIdx));
        model.regSetNote(updateMidi);

        // Play/stop
        guiView.regPlay(play);
        guiView.regStop(stop);
    }
}
