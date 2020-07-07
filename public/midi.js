let midi = null;

let inputCallbacks = [];

export function addInputListener(callback)
{
    inputCallbacks.push(callback);
}

export function removeInputListener(callback)
{
    inputCallbacks = inputCallbacks.filter(value => value != callback);
}

/// Send a message to all MIDI devices
export function sendAll(msg, time)
{
    if (!midi)
        return;

    for (let output of midi.outputs.values())
        output.send(msg, time);
}

function onMidiMessage(event)
{
    //console.log('got', event.data.length, 'bytes');

    var str = '';
    for (var i = 0; i < event.data.length; i++)
    {
        str += "0x" + event.data[i].toString(16) + " ";
    }
    console.log(str);

    for (let cb of inputCallbacks)
    {
        cb(event.data);
    }
}

function onMidiSuccess(midiAccess)
{
    console.log("MIDI ready");

    midi = midiAccess;

    for (let input of midiAccess.inputs.values())
    {
        input.onmidimessage = onMidiMessage;
    }
}

function onMidiFailure(msg)
{
    console.log("Failed to get MIDI access - " + msg);
}

// If MIDI is supported by this browser
if ('requestMIDIAccess' in navigator)
{
    // Note: no user authorization is required if sysex access is not requested
    navigator.requestMIDIAccess({ sysex: false }).then(onMidiSuccess, onMidiFailure);
}

/*
function getOutPort(midi, devName)
{
    var devName = devName.toLowerCase();

    for (var entry of midi.outputs)
    {
        var port = entry[1]
        var name = port.name.toLowerCase();

        if (name.startsWith(devName) || name.endsWith(devName))
            return port;
    }

    console.error('could not find output port "' + devName +'"');
    return null;
}
*/

export function noteOn(noteNo, vel, chanNo)
{
    if (vel == undefined)
        vel = 127;

    if (chanNo == undefined)
        chanNo = 0;

    // note on, note number, full velocity
    // omitting the timestamp means send immediately.
    return [0x90 + chanNo, noteNo, vel];
}

export function noteOff(noteNo, vel, chanNo)
{
    if (vel == undefined)
        vel = 127;

    if (chanNo == undefined)
        chanNo = 0;

    // note off, note number, full velocity
    return [0x80 + chanNo, noteNo, vel];
}

export function allNotesOff(chanNo)
{
    if (chanNo == undefined)
        chanNo = 0;

    // note off, note number, full velocity
    return [0xB0 + chanNo, 0x7B, 0];
}
