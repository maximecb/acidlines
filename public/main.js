import { Model } from './model.js';
import { GUIView } from './guiview.js';

// New, play, stop buttons
//let btnNew = document.getElementById('btn_new');
let btnPlay = document.getElementById('btn_play');
let btnStop = document.getElementById('btn_stop');

let model = new Model();
let view = new GUIView();

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
