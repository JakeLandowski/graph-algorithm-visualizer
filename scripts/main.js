/**
 *  @author Jake Landowski
 *  7/16/18
 *  main.js
 * 
 *  App entry point.
 */

'use strict';
 requirejs(['classes/graph/Graph', 'ui-animations/animations'], function(Graph, Animations)
 {
    // create Graph
    // configure graph
    // append to div
    // initialize events in graph (internal)
    // start graph loop

    // maintain html ui here, create an object for it
    // attach new graph as main graph, hooking up to the ui

    window.DEBUG_MODE = false;

    Animations.start();

    let graph = new Graph({ fullscreen: true });

    graph.appendTo(document.getElementById('main'));
    graph.start();


    const createNewBtn  = document.getElementById('createnewbtn');

    const addVertexBtn  = document.getElementById('add-vertex');
    const addEdgeBtn    = document.getElementById('add-edge');
    const editEdgeBtn   = document.getElementById('edit-edge');
    const undoBtn       = document.getElementById('undo');

    createNewBtn.addEventListener('click', function() { clearCanvas(); });
    addVertexBtn.addEventListener('click', function() { graph.vertexMode(); });
    addEdgeBtn.addEventListener('click',   function() { graph.edgeMode();   });
    undoBtn.addEventListener('click',      function() { graph.undo();       });

     function clearCanvas() {
         document.getElementById("main").innerHTML = "";
         graph = new Graph({ fullscreen: true });
         graph.appendTo(document.getElementById('main'));
         graph.start();
     }
 });