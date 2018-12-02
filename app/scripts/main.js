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
let randomDialogActive = false;
let elementIds = ['addButton','addEdgeButton','deleteButton'];
let functionArray = ['createMode','edgeMode','eraseMode'];
let graph;
newGraph({undirected: true});
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
            primary = darkGray;
            secondary = lightGray;
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
    newBtn[i].addEventListener('click', function(){document.getElementById('create-dialog').style.display = "block"});
}

directed.onclick = function () {
    graph = newGraph({undirected: false});
    document.getElementById('create-dialog').style.display = "none";
};

undirected.onclick = function () {
    graph = newGraph({undirected: true});
    document.getElementById('create-dialog').style.display = "none";
};


for(let i = 0; i<saveBtn.length; i++) {
    saveBtn[i].addEventListener('click', function(){graph.save();});
}

for(let i = 0; i<loadBtn.length; i++) {
    loadBtn[i].addEventListener('click', function(){graph.load();});
}

for(let i = 0; i<randomBtn.length; i++) {
    randomBtn[i].addEventListener('click', function(){
        randomDialogActive ? randomGraphDialog.style.display = 'none' :
                randomGraphDialog.style.display = 'block';
        randomDialogActive = !randomDialogActive;
    });
}

createRandomGraph.addEventListener('click',function() {
    randomProperties.directed = document.querySelector('input[name="directed"]:checked').value;
    randomProperties.weighted = document.querySelector('input[name="weighted"]:checked').value;
    newGraph({
        directed:randomProperties.directed,
        weighted:randomProperties.weighted
    });

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
    graph = new Graph(document.getElementById('main'), config);
}
