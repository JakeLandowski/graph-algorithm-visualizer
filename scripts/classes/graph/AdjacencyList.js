/**
 *  @author Jake Landowski
 *  8/1/18
 *  AdjacencyList.js
 * 
 *  Abstraction of an adjacency list for the Graph class
 */

'use strict';
define(function()
{
    const AdjacencyList = function(undirected)
    {
        this.undirected = undirected;
        this.vertexMap  = Object.create(null);
        this.edgeMap    = Object.create(null);
    };

    AdjacencyList.prototype = 
    {
        insertVertex(symbol, vertex)
        {
            this.vertexMap[symbol] = vertex;
        },

        getVertex(symbol)
        {
            return this.vertexMap[symbol];
        },

        deleteVertex(symbolOrVertex)
        {
            const symbol = symbolOrVertex instanceof Vertex
            const removing = this.vertexMap[symbol];

            if(removing)
            {
                delete this.vertexMap[symbol];

                removing.forEachEdge(function(edge)
                {
                    this.removeEdge({ from: edge.from, to: edge.to});

                }.bind(this));
            }
        },

        insertEdge(from, to, edge)
        {
            this.vertexMap[from] = to;
            this.vertexMap[to]   = from;

            this.edgeMap[ [from, to] ] = edge;
            if(this.undirected) 
                this.edgeMap[ [to, from] ] = edge;
        },

        getEdge(from, to)
        {
            return this.edgeMap[ [from, to] ];
        },

        deleteEdge()
        {

        },

        // Fucky one
        edgeExists()
        {

        }
    };

    return AdjacencyList;
});
