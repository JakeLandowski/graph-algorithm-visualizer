/**
 *  @author Jake Landowski
 *  7/16/18
 *  main.js
 * 
 *  App entry point.
 */

'use strict';
 requirejs(['tests/start-tests', 'classes/graph/Graph', 'ui-animations/animations'], function(Tests, Graph, Animations)
 {
    Tests.run();
    Animations.start();

    let graph = new Graph(document.getElementById('main'));

    const createNewBtn  = document.getElementsByClassName('creategraph');

    const addVertexBtn  = document.getElementsByClassName('addVertexButton');
    const addEdgeBtn    = document.getElementsByClassName('addEdgeButton');
    const editEdgeBtn   = document.getElementsByClassName('addWeightButton');
    const undoBtn       = document.getElementsByClassName('undoButton');
    const redoBtn       = document.getElementsByClassName('redoButton');

    for(let i = 0; i<createNewBtn.length; i++) {
        createNewBtn[i].addEventListener('click',function () {
            clearCanvas();
        })
    }

     for(let i = 0; i<addVertexBtn.length; i++) {
         addVertexBtn[i].addEventListener('click',function () {
             graph.vertexMode();
         })
     }

     for(let i = 0; i<addEdgeBtn.length; i++) {
         addEdgeBtn[i].addEventListener('click',function () {
             graph.edgeMode();
         })
     }

     for(let i = 0; i<editEdgeBtn.length; i++) {
         editEdgeBtn[i].addEventListener('click',function () {
             //DO SOMETHING.....
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

     function clearCanvas() {
         document.getElementById("main").innerHTML = "";
         graph = new Graph({ fullscreen: true });
         graph.appendTo(document.getElementById('main'));
         graph.start();
     }
 });