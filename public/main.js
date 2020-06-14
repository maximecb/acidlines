import { Model } from './model.js';
import { GUIView } from './guiview.js';
import { MIDIView } from './midiview.js';
import { Controller } from './controller.js';

let model = new Model();
let guiView = new GUIView();
let midiView = new MIDIView();
let controller = new Controller(model, guiView, midiView);

model.new();

document.body.onload = function ()
{
}

window.onunload = function ()
{
}
