/**
 *  @author Jake Landowski
 *  7/16/18
 *  main.js
 * 
 *  App entry point.
 */

'use strict';

import Graph from './classes/graph/Graph.js';
import Animations from './ui-animations/animations.js';

Animations.start();

let eduMode = document.getElementsByClassName('eduMode');
let primary = "#6ba2dc";
let secondary = "#2054a0";
let lightGray = "#9d9b98";
let darkGray = "#262626";
let white = "#fff";
let eduModeActive = false;
let elementIds = ['addVertexButton','addEdgeButton','eraseButton',
    'undoButton','redoButton'];
let functionArray = ['createMode','edgeMode','eraseMode','undo','redo'];
let graph = newGraph({undirected: false});
let createNewBtn  = document.getElementsByClassName('creategraph');
let selectGraphBtn  = document.getElementsByClassName('selectgraph');

addFunctionality();


for(let i = 0; i<eduMode.length; i++) {
    eduMode[i].onclick = function () {
        if(eduModeActive){
            Animations.swapColors(graph,primary,secondary,darkGray);
            window.localStorage.setItem('eduModeOn','false');
            eduModeActive = false;
        } else {
            Animations.swapColors(graph,darkGray,lightGray,white);
            window.localStorage.setItem('eduModeOn','true');
            eduModeActive = true;
        }
    };
}

for(let i = 0; i<createNewBtn.length; i++) {
    createNewBtn[i].addEventListener('click', function(){graph.save();});//newGraph);
}

for(let i = 0; i<selectGraphBtn.length; i++) {
    selectGraphBtn[i].addEventListener('click', function(){graph.load();});//newGraph);
}

function addFunctionality() {
    let elements;
    for(let i = 0; i<elementIds.length; i++){
        elements = document.getElementsByClassName(elementIds[i]);
        for(let j = 0; j<elements.length; j++){
            elements[j].addEventListener('click',function () {
            graph[functionArray[i]]();
        })
        }
    }
}

function newGraph(config={}) {
    document.getElementById("main").innerHTML = "";
    return new Graph(document.getElementById('main'), config);
}
