/**
 *  @author Jake Landowski
 *  7/16/18
 *  main.js
 * 
 *  App entry point.
 */

 requirejs(['classes/Engine', 'classes/graph/Graph'], function(Engine, Graph)
 {
    let graph = new Graph(Engine);
    // graph.addVertex('hi');
    // graph.addVertex('yo');
    // graph.addEdge('hi', 'yo');
    // graph.showGraphData();
 });