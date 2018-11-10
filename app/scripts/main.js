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

let eduMode = document.getElementsByClassName('eduButton');
let primary = "#6ba2dc";
let secondary = "#2054a0";
let lightGray = "#9d9b98";
let darkGray = "#262626";
let white = "#fff";
let eduModeActive = false;
let elementIds = ['addButton','addEdgeButton','deleteButton'];
let functionArray = ['createMode','edgeMode','eraseMode'];
let graph = newGraph({undirected: false});
let newBtn = document.getElementsByClassName('newButton');
let saveBtn  = document.getElementsByClassName('saveButton');
let loadBtn  = document.getElementsByClassName('loadButton');

addFunctionality();
setHighlights();

for(let i = 0; i<eduMode.length; i++) {
    eduMode[i].onclick = function () {
        let ui = document.getElementsByClassName('ui');
        if(eduModeActive){
            swapColors(graph,primary,secondary,darkGray);
            window.localStorage.setItem('eduModeOn','false');
            document.getElementById('pagestyle').setAttribute('href', 'css/graphvis.css');
            for(let j = 0; j<ui.length; j++) {
                ui[j].style.stroke = primary;
            }
            eduModeActive = false;
        } else {
            document.getElementById('pagestyle').setAttribute('href', 'css/graphedu.css');
            for(let j = 0; j<ui.length; j++) {
                ui[j].style.stroke = darkGray;
            }
            swapColors(graph,darkGray,lightGray,white);
            window.localStorage.setItem('eduModeOn','true');
            eduModeActive = true;
        }
    };
}

function setHighlights() {
    let elements = [
        'newButton', 'addButton', 'loadButton', 'eduButton', 'redoButton', 'deleteButton', 'saveButton'];
    let elementIds = ['newGraphButton', 'addModeButton', 'loadGraphButton', 'eduModeButton', 'redoModeButton',
        'deleteModeButton', 'saveGraphButton'];

    let arrayOfElements;
    for (let i = 0; i < elements.length; i++) {
        arrayOfElements = document.getElementsByClassName(elements[i]);
        for (let j = 0; j < arrayOfElements.length; j++) {
            arrayOfElements[j].addEventListener('mouseenter', function () {
                document.getElementById(elementIds[i]).style.stroke = (eduModeActive) ? lightGray : secondary;
            });

            arrayOfElements[j].addEventListener('mouseleave', function () {
                document.getElementById(elementIds[i]).style.stroke = (eduModeActive) ? darkGray : primary;
            });
        }
    }

    let menuButton = document.getElementsByClassName('mainButton');
    for (let i = 0; i < menuButton.length; i++) {
        menuButton[i].addEventListener('mouseenter', function () {
            document.getElementById('outer-spin-circle').style.stroke = (eduModeActive) ? lightGray : secondary;
            document.getElementById('inner-spin-circle').style.stroke = (eduModeActive) ? lightGray : secondary;
        });

        menuButton[i].addEventListener('mouseleave', function () {
            document.getElementById('outer-spin-circle').style.stroke = (eduModeActive) ? darkGray : primary;
            document.getElementById('inner-spin-circle').style.stroke = (eduModeActive) ? darkGray : primary;
        });
    }
}

function swapColors(graph,primary,secondary,bg) {
    //Change graph colors on click
    graph.config.backgroundColor[0] = bg;
    graph.config.vertexOutlineColor[0] = primary;
    graph.config.vertexTextColor[0] = primary;
    graph.config.vertexHoverColor[0] = secondary;
    graph.config.vertexSelectColor[0] = secondary;
    graph.config.edgeLineColor[0] = primary;
    graph.config.edgeTextColor[0] = primary;
    graph.config.edgeArrowColor[0] = primary;
    graph.config.edgeHoverColor[0] = secondary;
    graph.config.trackingEdgeColor[0] = secondary;
}


for(let i = 0; i<newBtn.length; i++) {
    newBtn[i].addEventListener('click', function(){graph = newGraph({undirected: true})});
}

for(let i = 0; i<saveBtn.length; i++) {
    saveBtn[i].addEventListener('click', function(){graph.save();});
}

for(let i = 0; i<loadBtn.length; i++) {
    loadBtn[i].addEventListener('click', function(){graph.load();});
}

function addFunctionality() {
    let elements;
    for(let i = 0; i<elementIds.length; i++){
        elements = document.getElementsByClassName(elementIds[i]);
        for(let j = 0; j<elements.length; j++){
            elements[j].addEventListener('click',function () {
            graph[functionArray[i]]();
        })}
    }
}

function newGraph(config={}) {
    document.getElementById("main").innerHTML = "";
    return new Graph(document.getElementById('main'), config);
}
