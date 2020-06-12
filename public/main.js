import { Model } from './model.js';
import { GUIView } from './guiview.js';
import { Controller } from './controller.js';

let btnPlay = document.getElementById('btn_play');
let btnStop = document.getElementById('btn_stop');

let model = new Model();
let view = new GUIView();
let controller = new Controller(model, view);

model.new();

document.body.onload = function ()
{
}

window.onunload = function ()
{
}

btnPlay.onclick = function ()
{
}

btnStop.onclick = function ()
{
}
