/**
 *  @author Jake Landowski
 *  7/16/18
 *  main.js
 * 
 *  App entry point.
 */

'use strict';
 requirejs(['tests/start-tests', 
            'classes/graph/Graph', 
            'ui-animations/animations'], 
function(Tests, Graph, Animations)
 {
    Tests.run();
    Animations.start();

     let eduMode = document.getElementsByClassName('eduMode');
     let lightOrange = "#ffcb48";
     let darkOrange = "#ff9a00";
     let lightGray = "#9d9b98";
     let darkGray = "#262626";
     let white = "#fff";
     let eduModeActive = false;

     for(let i = 0; i<eduMode.length; i++) {
         eduMode[i].addEventListener('click',function () {
             if(eduModeActive){
                 Animations.swapColors(graph,darkOrange,lightOrange,darkGray);
                 window.localStorage.setItem('eduModeOn','false');
                 eduModeActive = false;
             } else {
                 Animations.swapColors(graph,darkGray,lightGray,white);
                 window.localStorage.setItem('eduModeOn','true');
                 eduModeActive = true;
             }
         });
     }

    let graph = newGraph
    ({
        undirected: false
    }); 


    const createNewBtn  = document.getElementsByClassName('creategraph');
    const selectGraphBtn  = document.getElementsByClassName('selectgraph');

    const createBtn     = document.getElementsByClassName('addVertexButton');
    const addEdgeBtn    = document.getElementsByClassName('addEdgeButton');
    const eraseBtn      = document.getElementsByClassName('eraseButton');
    const undoBtn       = document.getElementsByClassName('undoButton');
    const redoBtn       = document.getElementsByClassName('redoButton');

    for(let i = 0; i<createNewBtn.length; i++) {
        createNewBtn[i].addEventListener('click', function(){graph.save();});//newGraph);
    }

    for(let i = 0; i<selectGraphBtn.length; i++) {
        selectGraphBtn[i].addEventListener('click', function(){graph.load();});//newGraph);
    }

     for(let i = 0; i<createBtn.length; i++) {
         createBtn[i].addEventListener('click',function () {
             graph.createMode();
         })
     }

     for(let i = 0; i<addEdgeBtn.length; i++) {
         addEdgeBtn[i].addEventListener('click',function () {
             graph.edgeMode();
         })
     }

     for(let i = 0; i<eraseBtn.length; i++) {
         eraseBtn[i].addEventListener('click',function () {
             graph.eraseMode();
         })
     }

     for(let i = 0; i<undoBtn.length; i++) {
         undoBtn[i].addEventListener('click',function () {
             graph.undo();
         })
     }

     for(let i = 0; i<redoBtn.length; i++) {
         redoBtn[i].addEventListener('click',function () {
             graph.redo();
         })
     }

     function newGraph(config={}) {
         document.getElementById("main").innerHTML = "";
         return new Graph(document.getElementById('main'), config);
     }
 });