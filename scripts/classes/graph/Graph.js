/**
 *  @author Jake Landowski
 *  7/16/18
 *  Graph.js
 * 
 *  Class to represent a Graph in various forms, uses Model and View
 *  to handle rendering and data logic.
 */

 define(['classes/graph/GraphModel', 'classes/graph/GraphView'], function(GraphModel, GraphView)
 {
    console.log('Graph Class loaded');

    const Graph = function(engine)
    {
        this.engine = engine;
        this.config = Object.create(null); // non-inheriting object
        this.model = new GraphModel();
        this.view  = new GraphView(this.model, this.engine.two);
    };

    Graph.prototype = 
    {
        addVertex(data)
        {
            this.model.addVertex(data);
        },

        addEdge(to, from)
        {
            this.model.addEdge(to, from);
        },

        showGraphData()
        {
            console.log('Adjacency List:');
            console.log('[\n');
            for(let data in this.model.adjList)
            {
                console.log('\t' + data + ' => [' + this.model.adjList[data] + '],');
            }
            console.log(']');
        }
        // methods
    };

    return Graph;
 });