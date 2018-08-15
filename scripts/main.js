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

    let graph = newGraph(); 

    const createNewBtn  = document.getElementsByClassName('creategraph');

    const createBtn     = document.getElementsByClassName('addVertexButton');
    const addEdgeBtn    = document.getElementsByClassName('addEdgeButton');
    const eraseBtn      = document.getElementsByClassName('eraseButton');
    const undoBtn       = document.getElementsByClassName('undoButton');
    const redoBtn       = document.getElementsByClassName('redoButton');

    for(let i = 0; i<createNewBtn.length; i++) {
        createNewBtn[i].addEventListener('click', newGraph);
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