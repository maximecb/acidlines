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

        // Accent clicked in the view
        function accentClick(stepIdx)
        {
            console.log('accent click')
            let curVal = model.getAccent(stepIdx);
            model.setAccent(stepIdx, !curVal);
        }

        // Shift up/down clicked in the view
        function shiftClick(stepIdx, val)
        {
            console.log('shift click', val)
            let curVal = model.getShift(stepIdx);

            if (val === curVal)
                model.setShift(stepIdx, 0);
            else
                model.setShift(stepIdx, val);
        }

        // Slide clicked in the view
        function slideClick(stepIdx)
        {
            console.log('slide click')
            let curVal = model.getSlide(stepIdx);
            model.setSlide(stepIdx, !curVal);
        }

        // Sustain clicked in the view
        function sustainClick(stepIdx)
        {
            console.log('sustain click')
            let curVal = model.getSustain(stepIdx);
            model.setSustain(stepIdx, !curVal);
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
        let updateMidi = () => midiView.setPattern(model.getPattern());

        // Pattern length changed
        guiView.regLength(newLen => model.setLength(newLen));
        model.regSetLength(() => guiView.selectPat(model.curPat, model.getPattern()));
        model.regSetLength(updateMidi);

        // Root note changed
        guiView.regRoot(rootNote => model.setRootNote(rootNote));
        model.regSetRoot(rootNote => guiView.setRootNote(rootNote));
        model.regSetRoot(rootNote => midiView.setRootNote(rootNote));

        // Tempo changed
        guiView.regTempo(tempo => model.setTempo(tempo));
        model.regSetTempo(tempo => guiView.setTempo(tempo));
        model.regSetTempo(tempo => midiView.setTempo(tempo));

        // New pattern selected
        model.regSelectPat((idx, pat) => guiView.selectPat(idx, pat));
        model.regSelectPat(updateMidi);

        // Note update
        guiView.regNoteClick(noteClick);
        model.regSetNote((stepIdx, noteIdx) => guiView.setNote(stepIdx, noteIdx));
        model.regSetNote(updateMidi);

        // Accent update
        guiView.regAccentClick(accentClick);
        model.regSetAccent((stepIdx, val) => guiView.setAccent(stepIdx, val));
        model.regSetAccent(updateMidi);

        // Shift update
        guiView.regShiftClick(shiftClick);
        model.regSetShift((stepIdx, val) => guiView.setShift(stepIdx, val));
        model.regSetShift(updateMidi);

        // Slide update
        guiView.regSlideClick(slideClick);
        model.regSetSlide((stepIdx, val) => guiView.setSlide(stepIdx, val));
        model.regSetSlide(updateMidi);

        // Sustain update
        guiView.regSustainClick(sustainClick);
        model.regSetSustain((stepIdx, val) => guiView.setSustain(stepIdx, val));
        model.regSetSustain(updateMidi);

        // Play/stop
        guiView.regPlay(play);
        guiView.regStop(stop);

        // Playback position highlighting
        midiView.regPlayPos((stepIdx) => model.setPlayPos(stepIdx));
        model.regPlayPos((stepIdx) => guiView.setPlayPos(stepIdx));
    }
}
