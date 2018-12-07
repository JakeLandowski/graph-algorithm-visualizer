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
import { stagger } from './utils/Utilities.js';
import RenderingEngine from "./classes/engine/RenderingEngine.js";

Animations.start();

let eduMode = document.getElementsByClassName('eduButton');
let primary = "#262626";
let secondary = "#9d9b98";
let white = "#fff";
let eduModeActive = false;
let randomDialogActive = false;
let elementIds = ['addButton','addEdgeButton','deleteButton'];
let functionArray = ['createMode','edgeMode','eraseMode'];
let newBtn = document.getElementsByClassName('newButton');
let saveBtn  = document.getElementsByClassName('saveButton');
let loadBtn  = document.getElementsByClassName('loadButton');
let undirected  = document.getElementById('undirected');
let directed  = document.getElementById('directed');
let randomBtn = document.getElementsByClassName('randomButton');
let randomGraphDialog = document.getElementById('random-graph-dialog');
let createRandomGraph = document.getElementById('generate-random-graph');
let randomProperties = {
    vertexNum:13,
    edgeDensity:50,
    directed:"undirected",
    weighted:"weighted"
};

let graph = newGraph({undirected: true});

addFunctionality();
setHighlights();
initResize();
initUndoRedo();

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
        'newButton', 'addButton', 'loadButton', 'eduButton', 'randomButton', 'deleteButton', 'saveButton'];
    let elementIds = ['newGraphButton', 'addModeButton', 'loadGraphButton', 'eduModeButton', 'randomModeButton',
        'deleteModeButton', 'saveGraphButton'];

    let arrayOfElements;
    for (let i = 0; i < elements.length; i++) {
        arrayOfElements = document.getElementsByClassName(elements[i]);
        for (let j = 0; j < arrayOfElements.length; j++) {
            arrayOfElements[j].addEventListener('mouseenter', function () {
                document.getElementById(elementIds[i]).style.stroke = secondary;
            });

            arrayOfElements[j].addEventListener('mouseleave', function () {
                document.getElementById(elementIds[i]).style.stroke = primary;
            });
        }
    }

    let menuButton = document.getElementsByClassName('mainButton');
    for (let i = 0; i < menuButton.length; i++) {
        menuButton[i].addEventListener('mouseenter', function () {
            document.getElementById('outer-spin-circle').style.stroke = secondary;
            document.getElementById('inner-spin-circle').style.stroke = secondary;
        });

        menuButton[i].addEventListener('mouseleave', function () {
            document.getElementById('outer-spin-circle').style.stroke = primary;
            document.getElementById('inner-spin-circle').style.stroke = primary;
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

//Slider for vertex density
let numVertexSlider = document.getElementById("vertex-number-slider");
let numVertex = document.getElementById("vertex-number");
numVertex.innerHTML = numVertexSlider.value;
numVertexSlider.oninput = function() {
    randomProperties.vertexNum = this.value;
    numVertex.innerHTML = this.value;
};

//Slider for vertex density
let edgeSlider = document.getElementById("edge-density-slider");
let edgeDensity = document.getElementById("edge-density");
edgeDensity.innerHTML = edgeSlider.value + "%";
edgeSlider.oninput = function() {
    randomProperties.edgeDensity = this.value;
    edgeDensity.innerHTML = this.value + "%";
};


for(let i = 0; i<newBtn.length; i++) {
    newBtn[i].addEventListener('click', function(){
        document.getElementById('create-dialog').style.display = "block"});
}

document.getElementById('create-dialog').onclick = function() {
    document.getElementById('create-dialog').style.display = "none";
};


directed.onclick = function () {
    graph.setConfig({undirected: false});
    RenderingEngine().clear();
    graph.clear();
    document.getElementById('create-dialog').style.display = "none";
};

undirected.onclick = function () {
    graph.setConfig({undirected: true});
    RenderingEngine().clear();
    graph.clear();
    document.getElementById('create-dialog').style.display = "none";
};

for(let i = 0; i<saveBtn.length; i++) {
    saveBtn[i].addEventListener('click', function(){graph.save();});
}

for(let i = 0; i<loadBtn.length; i++) {
    loadBtn[i].addEventListener('click', function(){graph.load();});
}

createRandomGraph.addEventListener('click',function() {
    randomProperties.directed = document.querySelector('input[name="directed"]:checked').value;
    randomProperties.weighted = document.querySelector('input[name="weighted"]:checked').value;
    randomProperties.edgeDensity = document.getElementById('edge-density-slider').value;
    randomProperties.vertexNum = document.getElementById('vertex-number-slider').value;
    
    graph.setConfig({
        directed:randomProperties.directed,
        weighted:randomProperties.weighted
    });

    RenderingEngine().clear();
    graph.clear();
    
    graph.randomize(
        randomProperties.vertexNum,
        randomProperties.edgeDensity);
});

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
    RenderingEngine().clear();
    return new Graph(document.getElementById('main'), config);
}

function initResize()
{
    window.addEventListener('resize', stagger(function(event)
    {
        event.preventDefault();
        graph.resize();
    }, 400));
}

function initUndoRedo()
{
    window.addEventListener('keydown', function(event)
    {
        // stops ALL keybinds on window
        // event.preventDefault();
        const key = event.keyCode;

        if(event.ctrlKey)
        { 
            if(key === 90)
            {
                if(event.shiftKey) graph.redo(); 
                else               graph.undo(); 
            }
            else if(key === 89) graph.redo();
        }
    });
}