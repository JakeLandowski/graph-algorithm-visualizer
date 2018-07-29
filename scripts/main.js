/**
 *  @author Jake Landowski
 *  7/16/18
 *  main.js
 * 
 *  App entry point.
 */

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

    document.getElementById("createnewbtn").onclick = function() {clearCanvas()};

     function clearCanvas() {
         document.getElementById("main").innerHTML = "";
         graph = new Graph({ fullscreen: true });
         graph.appendTo(document.getElementById('main'));
         graph.start();
     }
 });